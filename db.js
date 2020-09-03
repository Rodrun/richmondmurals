/* Database initialization and models */

const mongoose = require("mongoose");

/**
 * Connect to the database.
 * @param {string} uri Database connection URI
 */
exports.connect = (uri) => {
    mongoose.connect(uri,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        },
        err => {
            if (err) console.log(`mongoose error: ${err}`)
        }
    );
    mongoose.pluralize(null); // Disable pluralizing of collection name
    mongoose.set("useCreateIndex", true); // Avoid deprecated warning
}
