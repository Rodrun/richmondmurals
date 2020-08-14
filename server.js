const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path')
const mongoose = require("mongoose");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => console.log(`Listening on port ${port}`));


// Connect to DB
const URI = process.env.URI || "";
mongoose.connect(URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    err => {
        if (err) console.log(`mongoose error: ${err}`)
    }
);
// DB Model for active murals
const muralSchema = mongoose.Schema({
    properties: Object,
    geometry: Object,
});
var Mural = mongoose.model("murals", muralSchema);
// DB Model for pending murals
const pendingSchema = mongoose.Schema({
    geometry: Object,
    title: String,
    desc: String,
    artist: String,
    email: String,
    images: Array,
    reject: Boolean,
    notes:  String,
});
var PendingMural = mongoose.model("pending", pendingSchema);
var PendingReject = mongoose.model("reject", pendingSchema);

// List GET route
// This might not scale well, but for now it works fine
// Potentially in the future require certain params to limit the list size
app.get('/api/list', function(req, res) {
    Mural.find(function(err, response) {
        if (err) {
            res.send({ err: err })
        } else {
            res.send({ murals: response })
        }
    })
});

// Mural GET route
app.get("/api/mural/:id", function(req, res) {
    Mural.find({ _id: req.params.id }, function(err, response) {
        if (err) {
            res.send({ err: err })
        } else {
            res.send({ mural: response })
        }
    })
});

// Mural POST route
app.post("/api/submitviewer", function(req, res) {
    console.log(req.body);
});

// Production-ready build
if (process.env.NODE_ENV === "production") {
    // Client static file serving
    app.use(express.static(path.join(__dirname, "client", "build")));
    // Admin static file serving
    app.use("/admin/", express.static(path.join(__dirname, "admin", "build")));
    app.get("/admin/*", function(req, res) {
        res.sendFile(path.join(__dirname, "admin", "index.html"))
    });
}
