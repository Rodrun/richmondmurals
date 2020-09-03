const express = require("express");
const path = require("path");
const passport = require("passport");
const AnonymousStrategy = require("passport-anonymous").Strategy;
const session = require('express-session');
const cookieParser = require("cookie-parser");
const { connect } = require("./db.js");
const miscRoute = require("./routes.js");
const User = require("./models/user.js");
const morgan = require("morgan");

// Configure server & connect to DB
const app = express();

// // Pending Viewer Mural PUT
// app.put("/api/pendingviewer/:id", upload.array("image"), async function(req, res) {
//     console.log("PUT REQUEST");
//     console.log("ID: ", req.params.id);
//     const imageLinks = await uploadImages(req.files);
//     const formData = req.body;
//     let mural = {
//         properties: {
//             id: req.params.id,
//             date: new Date(),
//             title: formData.title,
//             email: formData.email,
//             images: imageLinks
//         },
//         geometry: {
//             type: "Point",
//             coordinates: [formData.lng, formData.lat]
//         }
//     };
//     PendingViewerMural.findByIdAndUpdate(req.params.id, mural, {useFindAndModify: false},
//         function (err, result) {
//             if (err) {
//                 console.error(err);
//                 res.send(err);
//             } else {
//                 console.log(result);
//                 res.send(result);
//             }
//         }
//     );
// });

// // Pending Artist Mural PUT
// app.put("/api/pendingartist/:id", upload.array("image"), async function(req, res) {
//     console.log("PUT REQUEST");
//     console.log("ID: ", req.params.id);
//     const imageLinks = await uploadImages(req.files);
//     const formData = req.body;
//     let mural = {
//         properties: {
//             id: req.params.id,
//             date: new Date(),
//             title: formData.title,
//             desc: formData.description,
//             artist: formData.artist,
//             email: formData.email,
//             images: imageLinks,
//             instagram: formData.instagram
//         },
//         geometry: {
//             type: "Point",
//             coordinates: [formData.lng, formData.lat]
//         }
//     };
//     PendingArtistMural.findByIdAndUpdate(req.params.id, mural, {useFindAndModify: false},
//         function (err, result) {
//             if (err) {
//                 console.error(err);
//                 res.send(err);
//             } else {
//                 console.log(result);
//                 res.send(result);
//             }
//         }
//     );
// });

const port = process.env.PORT || 8080;
const secret = process.env.SECRET || "elephant trunk"; // Session secret should be provided in prod env
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use("/", miscRoute);
app.use(morgan("tiny")); // Logging
connect(process.env.URI || ""); // db

// Local login strategy
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Anonymous authentication strategy
passport.use(new AnonymousStrategy());

// Production-ready build
if (process.env.NODE_ENV === "production") {
    // Client static file serving
    app.use(express.static(path.join(__dirname, "client", "build")));
    // Admin static file serving
    app.use("/admin/", express.static(path.join(__dirname, "admin", "build")));
    app.get("/admin/*", function(req, res) {
        res.sendFile(path.join(__dirname, "admin", "index.html"));
    });
}

// Finally, listen
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
