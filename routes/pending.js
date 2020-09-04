// Pending Murals routes
const router = require("express").Router();
const { getPendingType, isLoggedIn, validateMural, uploadImages, isAdmin } = require("../util.js");
const mongoose = require("mongoose");
const multer = require('multer');
const upload = multer();

// Pending Mural list GET
router.use("/:type", getPendingType);
router.get("/:type", async function(req, res) {
    let model = req.type;
    if (model != null) {
        try {
            const murals = await model.find().exec();
            res.send({
                list: murals,
                length: murals.length
            });
        } catch (error) {
            console.log(`PENDING MURAL GET ERROR: ${error}`);
            res.status(500).send({ error: error });
        }
    } else {
        res.sendStatus(404);
    }
});

// Pending mural POST
router.post("/:type",
    // isLoggedIn, // TO DO: add back in
    upload.array("image"),
    async function(req, res) {
        // Upload images to Cloudinary
        const imageLinks = await uploadImages(req.files);
        const formData = req.body;

        // Create JSON object using form data
        const id = mongoose.Types.ObjectId();
        let mural = {
            _id: id,
            type: "Feature",
            properties: {
                id: id.toHexString(),
                date: new Date(),
                title: formData.title,
                desc: formData.desc,
                artist: formData.artist,
                email: formData.email,
                instagram: formData.instagram,
                images: imageLinks,
                uploader: "anonymous uploader",
                notes: "",
                reject: false
            },
            geometry: {
                type: "Point",
                coordinates: [formData.lng, formData.lat]
            }
        };

        // Validate
        const validation = validateMural(mural)
        if (!validation.valid) {
            res.status(400).send({ error: validation.errors });
            return;
        }

        // Assign uploader value if existing user
        if (req.user) { 
            mural.properties.uploader = req.user.username;
        }

        let pMural = new req.type(mural);
        try {
            const posted = await pMural.save();
            res.status(201).send(posted);
        } catch (error) {
            console.log(`Pending Mural POST error: ${error}`);
            res.status(500).send({ error: error });
        }
    }
);

// Pending Mural individual GET
router.use("/:type/:id", getPendingType);
router.get("/:type/:id",
    isLoggedIn,
    async function(req, res) {
        let model = req.type;
        if (model != null) {
            try {
                const doc = await model.findById(req.params.id);
                if (doc) {
                    res.send(doc);
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                res.status(500).send({ error: error });
            }
        } else {
            res.sendStatus(400);
        }
    }
);

// Pending Mural individual PUT
router.put("/:type/:id",
    // isLoggedIn, // TO DO: add back in
    upload.array("image"),
    async function(req, res) {
        if (!req.type || !req.params.id) {
            res.sendStatus(404);
            return;
        }

        try {
            // Ensure the given ID exists
            let doc = await req.type.findById({ _id: req.params.id }).exec();
            if (!doc) {
                res.sendStatus(404);
                return;
            }

            // Upload images to Cloudinary
            const imageLinks = await uploadImages(req.files);
            const formData = req.body;

            // Create JSON object using form data
            let mural = {
                type: "Feature",
                properties: {
                    date: new Date(),
                    title: formData.title,
                    desc: formData.desc,
                    artist: formData.artist,
                    email: formData.email,
                    instagram: formData.instagram,
                    images: imageLinks,
                    id: req.params.id,
                    uploader: doc.properties.uploader,
                    reject: formData.reject === "reject",
                    notes: formData.notes
                },
                geometry: {
                    type: "Point",
                    coordinates: [formData.lng, formData.lat]
                }
            };

            // Validate request
            const validation = validateMural(mural);
            if (validation.valid && mural) {
                // Don't allow editing of reject & notes field unless admin
                // TO DO: add back in
                // if (req.user.perm != "admin") {
                //     mural.properties.reject = doc.properties.reject;
                //     mural.properties.admin = doc.properties.admin;
                // }

                const nDoc = await req.type.findByIdAndUpdate(req.params.id,
                    mural,
                    {
                        lean: true,
                        new: true,
                        useFindAndModify: false
                    }).exec();
                res.send(nDoc);
            } else {
                console.log(validation.errors);
                res.status(400).send({ error: validation.errors });
            }
        } catch (error) {
            console.log("--->PENDING MURAL INDIVIDUAL PUT ERROR: " + error + "\n" + error.stack);
            res.status(500).send({ error: error });
        }
    }
);

// Pending Mural individual DELETE
router.delete("/:type/:id",
    // isLoggedIn, // TO DO: add in
    // isAdmin, // TO DO: add in
    async function(req, res) {
        if (!req.type || !req.params.id) {
            res.sendStatus(404);
            return;
        }
        try {
            req.type.findByIdAndDelete(req.params.id, function (err) {
                if (err) {
                    console.log("--->PENDING MURAL DELETION ERROR: " + err);
                } else {
                    res.sendStatus(200);
                }
            });
        } catch (error) {
            res.status(500).send({ error: error });
        }   
    }
);

module.exports = router;
