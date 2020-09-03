// Base API routes
const router = require("express").Router();
const listAPI = require("./list.js");
const pendingAPI = require("./pending.js");

router.use("/list", listAPI);
router.use("/pending", pendingAPI);

module.exports = router;
