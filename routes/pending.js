// Pending Murals routes
const router = require("express").Router();
const { getPendingType, isLoggedIn, validateMural } = require("../util.js");


// TO DO: how to organize this
const path = require("path");
const mongoose = require("mongoose");
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const DataUriParser = require("datauri/parser");
const parser = new DataUriParser();


const uploader = async (file) => {
    return await cloudinary.uploader.upload(file, (error, result) => {
        if (error) console.log(error);
    });
};

const formatFile = file => {
    return parser.format(
        path.extname(file.originalname).toString(),
        file.buffer
    ).content;
};

const uploadImages = async (files) => {
    const imageLinks = [];
    for (file of files) {
        if (file.mimetype.split('/')[0] === "image") {
            const formattedFile = formatFile(file);
            const result = await uploader(formattedFile);
            const url = result.url;
            imageLinks.push(url);  
        } 
    }
    return imageLinks;
}
// END TO DO

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
                desc: formData.description || "",
                artist: formData.artist || "",
                email: formData.email,
                instagram: formData.instagram || "",
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
            console.log("NOT VALID");
            res.status(400).send({ error: validation.errors });
            return;
        }

        // Properly assign uploader value
        if (req.user) { // Existing user
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
    isLoggedIn,
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

            // Validate request
            const validation = validateMural(req.body);
            if (validation.valid && req.body) {
                // Ensure id and uploader fields are not modified
                req.body._id = req.params.id;
                req.body.properties.id = req.params.id;
                req.body.properties.uploader = doc.properties.uploader;
                // Don't allow editing of reject & notes field unless admin
                if (req.user.perm != "admin") {
                    req.body.properties.reject = doc.properties.reject;
                    req.body.properties.admin = doc.properties.admin;
                }

                const nDoc = await req.type.findByIdAndUpdate(req.params.id,
                    req.body,
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

module.exports = router;
