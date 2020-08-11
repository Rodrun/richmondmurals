const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");

app.listen(port, () => console.log(`Listening on port ${port}`));


// Connect to DB
const URI = process.env.URI || "";
mongoose.connect(URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    err => console.log(`mongoose callback: ${err}`));
// Create DB Model for querying
const muralSchema = mongoose.Schema({
    address: Object,
    name: String,
});
var Mural = mongoose.model("murals", muralSchema);

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

// Production-ready build
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.use("/admin", express.static("admin/build"));
}
