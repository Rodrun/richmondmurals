// Backend integration test
// NOTE: MUST CONNECT TO testmondmurals COLLECTION
// Assumes that test admin account is available in the collection
// Environment variables:
// TEST_ADMIN_USERNAME
// TEST_ADMIN_PASSWORD
const app = require("../server.js");
const assert = require("assert");
const request = require("supertest");
const { registerUser } = require("../util.js");
const user = require("../models/user.js");

// Init superagent
const agent = request.agent(app);

// Test admin login
const TEST_ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME || "testadmin";
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "xyz";

async function registerAdmin() {
    // Register an admin account
    try {
        await registerUser(user, TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD, "admin");
    } catch (error) {
        // UserExistsError
    }
}

async function preventNonTest() {
    // Allow running if no URI given anyway
    if (process.env.URI) {
        // Prevent tests from running if not using testmondmurals collection
        if (!String(process.env.URI).match("testmondmurals")) {
            console.error("Didn't detect that you were connecting to testmondmurals collection");
            this.skip();
        } else {
            await registerAdmin();
            await loginAdmin();
        }
    }
}

function loginAdmin() {
    return agent
        .post("/login")
        .send({ username: TEST_ADMIN_USERNAME, password: TEST_ADMIN_PASSWORD })
        .expect(302)
        .expect("Location", "/");
}

describe("Session", function() {
    before(preventNonTest);
    describe("Login", function() {
        it("into test admin account", async function() {
            await loginAdmin();
        });
    });
});

describe("Backend: User", function() {
    before(preventNonTest);
    describe("GET /user", function() {
        it("should successfully get existing user info", function() {
            return agent
                .get("/user/" + TEST_ADMIN_USERNAME)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8");
        });
        it("should return 404 on non-existent user", function() {
            return agent
                .get("/user") // Empty user id = non-existent guaranteed
                .expect(404);
        });
    });
    describe("POST /user", function() {
        it("should successfully register test user", function() {
            return agent
                .post("/user")
                .send({ "username": "delete", "password": "test" })
                .set("Accept", "application/json")
                .expect(302)
                .expect("Location", "/login");
        });
        it("should return 500 on duplicate username", function() {
            return agent
                .post("/user")
                .send({ "username": "delete", "password": "xyz" })
                .set("Accept", "json")
                .expect(500);
        });
    });
    describe("DELETE /user", function() {
        it("should delete the created test user as admin", function() {
            // First, create user
            return agent
                .delete("/user/delete")
                .expect(200);
        });
        it("should return 404 if user not found", function() {
            return agent
                .delete("/user/____no____") // This shouldn't exist
                .expect(404);
        });
    });
});

describe("Backend: Active Murals", function() {
    before(preventNonTest);
    describe("GET /api/list", function() {
        it("should return an array of Mural objects", function() {
            return agent
                .get("/api/list")
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .then(res => {
                    assert.strictEqual("murals" in res.body, true, "body.mural does not exist as a field");
                    assert.strictEqual(res.body.murals instanceof Array, true, "body.mural is not of type array");
                });
        });
    });
    describe("POST /api/list", function() {
        it("should return 401 on no login", function() {
            return request(app) // No agent; no login
                .post("/api/list")
                .expect(401);
        });
        it("should return uploaded Mural object and 201", function() {
            return agent
                .post("/api/list")
                .send(
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [73.6, 48.2]
                        },
                        "properties": {
                            "title": "My Mural",
                            "desc": "My description",
                            "artist": "My name, maybe contact info",
                            "email": "Submitter@email.net",
                            "images": [{
                                id: "cloudinary_public_id",
                                url: "https://image.com/myImage"
                            }],
                            "id": "TEST",
                            "uploader": "TEST",
                            "reject": false,
                            "notes": "yadda yadda yadda"
                        }
                    }
                )
                .expect(201)
                .expect("Content-Type", "application/json; charset=utf-8")
                .then(res => {
                    assert.notStrictEqual(res.body.properties.id, undefined);
                    assert.notStrictEqual(res.body.properties.uploader, undefined);
                    // Check that reject and notes are removed
                    assert.strictEqual(res.body.properties.reject, undefined);
                    assert.strictEqual(res.body.properties.notes, undefined);
                });
        });
        it("should return 400 on invalid Mural", function() {
            return agent
                .post("/api/list")
                .send({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [1, 1]
                    },
                })
                .set("Accept", "application/json")
                .expect(400);
        });
    });
});

describe("Backend: Pending Murals", function() {
    before(preventNonTest);
    describe("GET /api/pending", function() {
        it("should get artist & viewer pending murals as admin", async function() {
            // Artist
            await agent
                .get("/api/pending/artist")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8");
            // Viewer
            await agent
                .get("/api/pending/viewer")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8");
        });
        it("should return 404 on invalid type path param", function() {
            return agent
                .get("/api/pending/xyz")
                .expect(404);
        })
    });
    describe("POST /api/pending", function() {
        // Test Pending Mural
        const pMural = {
            "_id": "This should be replaced",
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [73.6, 48.2]
            },
            "properties": {
                "date": new Date(),
                "title": "My Mural",
                "desc": "My description",
                "artist": "My name, maybe contact info",
                "email": "Submitter@email.net",
                "images": [{
                    id: "cloudinary_public_id",
                    url: "https://image.com/myImage"
                }],
                "id": "This should be _id after post",
                "uploader": "........",
                "reject": true,
                "notes": "yadda yadda yadda"
            }
        };

        // Helper POST function
        async function post(type) {
            const doc = await agent
                .post(`/api/pending/${type}`)
                .send(pMural)
                .expect(201)
                .expect("Content-Type", "application/json; charset=utf-8");
            // Get mural, expect existence
            return agent
                .get(`/api/pending/${type}/${doc._id}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8");
        }

        // Helper POST test function
        async function testPost(type) {
            let pend = await post(type);
            //console.log("pend ==========     ==== " + pend)
            assert.notStrictEqual(pend, undefined);
            // First check that the IDs have been changed
            const id = pend._id; // Both _id and properties.id should be the same
            assert.notStrictEqual(id, pMural._id);
            assert.notStrictEqual(id, pMural.properties.id);
            assert.strictEqual(id, pend.properties.id);

            // Then check if the rest is as expected
            const expected = {
                "_id": id,
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [73.6, 48.2]
                },
                "properties": {
                    "title": "My Mural",
                    "desc": "My description",
                    "artist": "My name, maybe contact info",
                    "email": "Submitter@email.net",
                    "images": [{
                        id: "cloudinary_public_id",
                        url: "https://image.com/myImage"
                    }],
                    "id": id,
                    "uploader": TEST_ADMIN_USERNAME,
                    "reject": false,
                    "notes": ""
                }
            }
            assert.deepStrictEqual(pend, expected);
        }

        it("should post valid pending viewer mural", function() {
            try {
                testPost("viewer");
            } catch (error) {
                throw error;
            }
        });
        it("should post valid pending artist mural", function() {
            try {
                testPost("artist");
            } catch (error) {
                throw error;
            }
        });
        it("should return 400 on invalid mural", function() {
            const inv = {
                "properties": {
                    "desc": 32
                }
            };
            return agent
                .post("/api/pending/viewer")
                .send(inv)
                .expect(400);
        });
        it("should return 404 on invalid type path param", function() {
            return agent
                .post("/api/pending/ohboy")
                .expect(404);
        });
    });
    describe("PUT /api/pending", function() {
        it("should return modified pending mural", async function() {
            const input = {
                "_id": "This should be replaced",
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [73.6, 48.2]
                },
                "properties": {
                    "title": "My Mural",
                    "desc": "My description",
                    "artist": "My name, maybe contact info",
                    "email": "Submitter@email.net",
                    "images": [{
                        id: "cloudinary_public_id",
                        url: "https://image.com/myImage"
                    }],
                    "id": "This should be _id after post",
                    "uploader": "This should be replaced",
                    "reject": false,
                    "notes": "yadda yadda yadda"
                }
            };
            let _id = null;
            await agent
                .post("/api/pending/artist")
                .send(input)
                .expect(201)
                .expect("Content-Type", "application/json; charset=utf-8")
                .then(res => {
                    _id = res.body._id;
                });
            const modification = {
                "_id": "This is an invalid field to mod",
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [73.6, 48.2]
                },
                "properties": {
                    "title": "My Mural",
                    "desc": "I changed the description",
                    "artist": "My name, maybe contact info",
                    "images": [{
                        id: "cloudinary_public_id",
                        url: "https://image.com/myImage"
                    },
                    {
                        id: "cloudinary_public_id_2",
                        url: "https://google.com"
                    }],
                    "uploader": "This better be changed as well",
                    "reject": true,
                    "notes": ""
                }
            };
            const expected = {
                "_id": _id,
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [73.6, 48.2]
                },
                "properties": {
                    "title": "My Mural",
                    "desc": "I changed the description",
                    "artist": "My name, maybe contact info",
                    "email": "Submitter@email.net",
                    "images": [{
                        id: "cloudinary_public_id",
                        url: "https://image.com/myImage"
                    },
                    {
                        id: "cloudinary_public_id_2",
                        url: "https://google.com"
                    }],
                    "id": _id,
                    "uploader": TEST_ADMIN_USERNAME,
                    "reject": true,
                    "notes": ""
                },
                "__v": 0
            };
            // Update
            const actual = await agent
                .put(`/api/pending/artist/${_id}`)
                .send(modification)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8");
            const body = actual.body;
            //assert.deepStrictEqual(actual.body, expected);
            assert.deepStrictEqual(body._id, expected._id);
            //assert.deepStrictEqual(body.properties, expected.properties);
            const serial = (obj) => Object.keys(obj).sort();
            assert.strictEqual(serial(body.properties) == serial(expected.properties), true);
            assert.deepStrictEqual(body.geometry, expected.geometry);
            assert.deepStrictEqual(body.type, expected.type);
        });
    });
});
