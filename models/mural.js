// DB Model for active murals
const mongoose = require("mongoose");

mongoose.pluralize(null);

const geometrySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    coordinates: [ Number ]
}, { required: true, _id: false });

// DB Model for Active Murals
const muralSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Feature",
    },
    properties: {
        type: Object,
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            default: "No description."
        },
        artist: {
            type: String,
            default: "Unkown"
        },
        email: {
            type: String,
            default: "No email"
        },
        images: [ String ],
        uploader: {
            type: String,
            default: "Anonymous"
        },
        required: true
    },
    geometry: geometrySchema
});

exports.Mural = mongoose.model("murals", muralSchema);

// DB Model for pending murals
const pendingArtistSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Feature"
    },
    properties: {
        type: Object,
        title: {
            type: String,
            required: true
        },
        desc: String,
        artist: String,
        email: String,
        images: [ String ],
        uploader: String,
        notes: String,
        reject: Boolean,
        required: true
    },
    geometry: geometrySchema
});
exports.PendingArtistMural = mongoose.model("pendingArtist", pendingArtistSchema);
exports.PendingViewerMural = mongoose.model("pendingViewer", pendingArtistSchema);
