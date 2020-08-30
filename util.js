const validate = require("jsonschema").validate;
const { PendingArtistMural, PendingViewerMural } = require("./models/mural.js");

const GeoJSONSchema = {
    "id": "/GeoJSON",
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "enum": ["Feature"],
            "required": true
        },
        "geometry": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": [
                        "Point",
                        "LineString",
                        "Polygon",
                        "MultiPoint",
                        "MultiLineString",
                        "MultiPolygon"
                    ]
                },
                "coordinates": {
                    "type": "array"
                }
            },
            "required": true
        },
        "properties": {
            "type": "object",
            "required": true,
            "properties": {
                "title": {
                    "type": "string",
                    "maxLength": process.env.MAX_TITLE_LEN || 80
                },
                "desc": {
                    "type": "string",
                    "maxLength": process.env.MAX_DESC_LEN || 1500
                },
                "artist": {
                    "type": "string",
                    "maxLength": process.env.MAX_ARTIST_LEN || 255
                },
                "email": {
                    "type": "string",
                    "maxLength": process.env.MAX_EMAIL_LEN || 254
                },
                "images": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "format": "uri",
                        "maxItems": process.env.MAX_IMAGES || 10
                    }
                },
                "id": {
                    "type": "string"
                },
                "reject": {
                    "type": "boolean"
                },
                "notes": {
                    "type": "string",
                    "maxLength": process.env.MAX_NOTES_LEN || 1750
                }
            }
        }
    }
};

/**
 * Validate given Mural object.
 * @param {Object} geojson GeoJSON object to validate.
 * @returns Object with "error" array and "valid" boolean.
 */
exports.validateMural = function(geojson) {
    return validate(geojson, GeoJSONSchema);
};

/**
 * Pending mural type identifier middleware
 * Sets req.type to the appropriate model, or sets it to null if type path param is invalid.
 */
exports.getPendingType = function (req, res, next) {
    switch (req.params.type) {
        case "artist":
            req.type = PendingArtistMural;
            next();
            break;
        case "viewer":
            req.type = PendingViewerMural;
            next();
            break;
        default:
            req.type = null;
            res.sendStatus(404);
            break;
    }
};

/**
 * Register a new user to the db.
 * @param {String} username 
 * @param {String} password 
 * @param {String} perm
 * @returns {Promise}
 */
exports.registerUser = function(User, username, password, perm) {
    return User.register(new User({ username: username, perm: perm }), password);
};

/**
 * Check if user is logged in middleware.
 */
exports.isLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        next();
    }
};

/**
 * Check if user has admin permission. Should be AFTER isLoggedIn.
 */
exports.isAdmin = function(req, res, next) {
    if (req.user) {
        if (req.user.perm == "admin") {
            return next();
        }
    }
    res.sendStatus(403);
};
