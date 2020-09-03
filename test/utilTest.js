const assert = require("assert");
const { validateMural, getPendingType, registerUser, isLoggedIn, isAdmin } = require("../util.js");
const { PendingArtistMural, PendingViewerMural } = require("../models/mural.js");
const User = require("../models/user.js");

describe("util", function() {
    describe("#validateMural()", function() {
        const perfectlyValid = {
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
                "images": ["https://image.com/myImage"],
                "id": ".............",
                "reject": false,
                "notes": "yadda yadda yadda"
            }
        };
        const missingType = {
            "geometry": {
                "type": "Point",
                "coordinates": [72, 69]
            },
            "properties": {
                "id": "0000-0000-000000"
            }
        };
        const missingGeometry = {
            "type": "Feature",
            "properties": {
                "title": "My Mural",
                "desc": "My description",
                "artist": "My name, maybe contact info",
                "email": "Submitter@email.net",
                "images": ["https://image.com/myImage"],
                "id": ".............",
                "reject": false,
                "notes": "yadda yadda yadda"
            }
        };
        const reallyWrong = {
            "geometry": {
                "Type": 24
            },
            "properties": {
                "reject": "true",
                "images": ["tulips.mp3"] 
            }
        }

        // Test against valid mural
        const validRet = validateMural(perfectlyValid);
        it("should return valid=true when valid Mural is passed", function() {
            assert.strictEqual(validRet.valid, true);
        });
        it("should not return any errors when valid Mural is passed", function() {
            assert.strictEqual(validRet.errors.length, 0);
        });

        // Test against missing Type mural
        const typeRet = validateMural(missingType);
        it("should return valid=false when missing Type field", function() {
            assert.strictEqual(typeRet.valid, false);
        });
        it("should return errors when missing Type field", function() {
            assert.notStrictEqual(typeRet.errors.length, 0);
        });

        // Test against missing geometry field mural
        const geometryRet = validateMural(missingGeometry);
        it("should return valid=false when missing geometry field", function() {
            assert.strictEqual(geometryRet.valid, false);
        });
        it("should return errors when missing geometry field", function() {
            assert.notStrictEqual(typeRet.errors.length, 0);
        })

        // Test against really wrong mural
        const reallyRet = validateMural(reallyWrong);
        it("should return valid=false when really wrong Mural is passed", function() {
            assert.strictEqual(reallyRet.valid, false);
        });
        it("should return errors because it's so wrong", function() {
            assert.notStrictEqual(reallyRet.errors.length, 0);
        });
    });

    describe("#getPendingType", function() {
        const emptyDone = () => { };
        let req = { params: { type: null } };

        it("should set req.type to PendingArtistMural when type is 'artist'", function() {
            req.params.type = "artist";
            getPendingType(req, undefined, emptyDone);
            assert.strictEqual(req.type, PendingArtistMural);
        });
        it("should set req.type to PendingViewerMural when type is 'viewer'", function() {
            req.params.type = "viewer";
            getPendingType(req, undefined, emptyDone);
            assert.strictEqual(req.type, PendingViewerMural);
        });
        it("should send 404 when type is neither 'artist' or 'viewer'", function() {
            req.params.type = "joseph joestar";
            const dummyRes = {
                sendStatus: function(code) {
                    assert.strictEqual(code, 404);
                }
            }
            getPendingType(req, dummyRes, emptyDone);
        });
    });
    describe("#registerUser", function() {
        it("should register new user", async function() {
            const username = "thisTestUserShouldBeDeleted";
            await registerUser(User, username, "johndoe2020", "user");
            assert.notStrictEqual(await User.findOneAndDelete({ username: username }), null);
        });
    });
    describe("#isLoggedIn", function() {
        it("should call next() if authenticated", function(done) {
            let success = false;
            const next = () => {
                success = true;
            };
            const dummyReq = {
                isAuthenticated: () => true
            };
            isLoggedIn(dummyReq, undefined, next);
            if (!success) done(new Error("expected next() to be called"));
            else done();
        });
        it("should send 401 if not authenticated", function(done) {
            let badNext = false;
            const next = () => {
                badNext = true; // This is unexpected behavior
            };
            const dummyReq = {
                isAuthenticated: () => false
            };
            const dummyRes = {
                sendStatus: (code) => {
                    assert.strictEqual(code, 401);
                }
            };
            isLoggedIn(dummyReq, dummyRes, next);
            if (badNext) done(new Error("did not expect next() to be called"));
            else done();
        });
    });
    describe("#isAdmin", function() {
        it("should call next() if admin", function() {
            const dummyReq = {
                user: {
                    perm: "admin"
                }
            };
            let success = false;
            const next = () => {
                success = true;
            };
            let resCalled = false;
            const dummyRes = {
                sendStatus: () => {
                    resCalled = true;
                }
            };
            isAdmin(dummyReq, dummyRes, next);
            assert.strictEqual(success, true, "expected next() to be called");
            assert.strictEqual(resCalled, false, "did not expect res to be used");
        });
        it("should send 403 if not admin", function() {
            const dummyReq = {
                user: {
                    perm: "user"
                }
            };
            let success = false;
            const dummyRes = {
                sendStatus: (code) => {
                    assert.strictEqual(code, 403);
                    success = true;
                }
            };
            let nextCalled = false;
            const next = () => {
                nextCalled = true;
            };
            isAdmin(dummyReq, dummyRes, next);
            assert.strictEqual(success, true, "expected res.sendStatus(403) to be called");
            assert.strictEqual(nextCalled, false, "did not expect next() to be called");
        });
    });
});
