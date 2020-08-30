// Pending Murals routes
const router = require("express").Router();
const { getPendingType, isLoggedIn, validateMural } = require("../util.js");

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
    isLoggedIn,
    async function(req, res) {
        // Validate
        const validation = validateMural(req.body)
        if (!validation.valid) {
            res.status(400).send({ error: validation.errors });
            return;
        }

        // Properly assign uploader value
        let uploader = "anonymous uploader";
        if (req.user) { // Existing user
            uploader = req.user.username;
        }
        req.body.properties.uploader = uploader;

        // Default pending-specific fields
        req.body.properties.reject = false;
        req.body.properties.notes = "";

        // Delete any given id
        delete req.body._id;
        delete req.body.properties.id;

        let pMural = new req.type(req.body);
        // Repopulate properties.id to actual id
        pMural.properties.id = pMural._id;
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
