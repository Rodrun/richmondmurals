// Misc routes
const router = require("express").Router();
const passport = require("passport");
const api = require("./routes/api.js");
const user = require("./routes/user.js");

router.use("/api", api);
router.use("/user", user);

/**
 * Login an existing user.
 */
router.post("/login",
    passport.authenticate("local", { failureRedirect: "/login", successRedirect: "/" })
);

/**
 * Logout user.
 */
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;
