// User routes
const User = require("../models/user.js");
const { registerUser, isLoggedIn } = require("../util.js");
const router = require("express").Router();

// Register new user
router.post("/", function(req, res) {
    registerUser(User, req.body.username, req.body.password, "user")
        .then(() => {
            res.redirect(req.query.redirect || "/login");
        })
        .catch(err => {
            res.status(500).send({ "error": err });
        })
});

// Basic user info
router.get("/:username",
    async function(req, res) {
        try {
            const doc = await User.findOne({ username: req.params.username }).exec();
            if (doc == null) {
                res.sendStatus(404);
            } else {
                res.status(200).send({
                    username: doc.username,
                    perm: doc.perm
                });
            }
        } catch (error) {
            res.status(500).send({ error: error });
        }
    }
);

// Delete existing user
router.delete("/:username",
    isLoggedIn,
    async function(req, res) {
        const username = req.params.username;
        console.log(`User ${req.user.username} is deleting account ${username}`);
        if (!username) {
            res.status(400).send({ "error": "No given username" });
            return;
        }
        if (req.user.perm == "admin" || req.user.username == username) {
            try {
                const exists = await User.exists({ username: username });
                if (exists) {
                    const del = await User.findOneAndDelete({ username: username }).exec();
                    if (del) {
                        res.sendStatus(200);
                    }
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                res.status(500).send({ error: error });
            }
        } else {
            res.sendStatus(403);
        }
    }
);

module.exports = router;
