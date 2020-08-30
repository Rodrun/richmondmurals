const mongoose = require("mongoose");
const passLocalMongo = require("passport-local-mongoose");

mongoose.pluralize(null);
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    perm: String,
    name: String
});
userSchema.plugin(passLocalMongo);

module.exports = mongoose.model("user", userSchema);
