const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const multer = require('multer');
const app = express();

const upload = multer();

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));


// TODO: Move this section to separate file for organizational purposes 
// Connect to DB
const URI = process.env.URI || "";
mongoose.pluralize(null); // Disable pluralizing of collection name
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

// Admin User db model
const adminSchema = mongoose.Schema({
    username: String, // Username (should be) is an email
    password: String // Hashed password, don't store cleartext passwords!
});
var Admin = mongoose.model("admin", adminSchema)

passport.use(new LocalStrategy(function(username, password, done) {
    // TODO: Add verifcation with bcrypt
    return done(null, username);
}));

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

// Pending Mural list GET
app.get("/api/pending", function(req, res) {
    Mural.find(function(err, response) {
        if (err) {
            res.status(500).send({
                msg: err
            });
        } else {
            res.status(200).send({
                list: response,
                length: response.length
            });
        }
    });
});

app.post("/api/pending/:id", function(req, res) {
    // TODO
});

app.put("/api/pending/:id", function(req, res) {
    // TODO
});

// Mural viewer POST route
// To do: change route to match /api/pending/:id format
app.post("/api/submitviewer", upload.single("image"), function(req, res) {
    const formData = req.body;
    
    const image = req.file;
    // To do: upload image to Google Drive

    let pendingMural = new PendingMural({
        email: formData.email
    });

    pendingMural.save()
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            console.error(err);
        })
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
