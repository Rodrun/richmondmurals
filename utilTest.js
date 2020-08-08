const assert = require("assert");
const { cleanObject } = require("./util");

describe("util.cleanObject", function () {
    const cleaned = cleanObject({ "foo": null, "bar": undefined })
    it("should return an object no undefined values", (done) => {
        for (val in cleaned) {
            assert.notEqual(val, undefined)
        }
    })
});
