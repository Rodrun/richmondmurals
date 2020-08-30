// Active Murals list routes
const router = require("express").Router();
const { Mural } = require("../models/mural.js");
const { validateMural, isLoggedIn, isAdmin } = require("../util.js");

// List GET
router.get("/", function(req, res) {
    Mural.find(function(err, response) {
        if (err) {
            res.json({ err: err });
        } else {
            res.json({ murals: response });
        }
    });
});

// Mural POST
router.post("/",
    isLoggedIn,
    isAdmin,
    async function(req, res) {
        // Validate data
        const validation = validateMural(req.body);
        if (validation.valid) {
            // Remove unnecessary fields
            delete req.body.properties.reject;
            delete req.body.properties.notes;
            // Upload to DB
            let posted = new Mural(req.body);
            try {
                const ret = await posted.save();
                res.status(201).send(ret);
            } catch (error) {
                res.status(500).send({ error: error });
            }
        } else {
            res.status(400).send({ error: validation.errors });
        }
    },
);

// Individual Mural PUT
router.put("/:id",
    isLoggedIn,
    isAdmin,
    async function(req, res) {
        // Validate data
        const validation = validateMural(req.body);
        const id = req.params.id;
        if (validation.valid) {
            try {
                // Update
                const updated = await Mural.findByIdAndUpdate(id,
                    req.body,
                    {
                        lean: true,
                        new: true
                    }).exec();
                res.send(updated);
            } catch (error) {
                res.status(500).send({ error: error });
            }
        } else {
            res.sendStatus(400);
        }
    }
);

// Individual Mural GET
router.get("/:id", async function(req, res) {
    try {
        const mural = await Mural.findById(req.params.id).exec();
        if (mural) {
            res.send(mural);
        } else {
            res.status(404);
        }
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

module.exports = router;
