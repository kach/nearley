const expect = require("expect");

const lint = require("../lib/lint");

describe("Linter", function() {
    var mockGrammar, mockOpts, writeSpy;

    beforeEach(function () {
        mockGrammar = {
            rules: [],
            config: {}
        };
        mockOpts = {
            out: {
                write() {}
            }
        };
        writeSpy = expect.spyOn(mockOpts.out, "write");
    })

    it("runs without warnings on empty rules", function () {
        lint(mockGrammar, mockOpts);
        expect(writeSpy).toNotHaveBeenCalled();
    });

    it("warns about undefined symbol", function () {
        mockGrammar.rules = [
            {name: "a", symbols: ["non-existent"]}
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy).toHaveBeenCalled();
    });

    it("doesn't warn about defined symbol", function () {
        mockGrammar.rules =  [
            {name: "a", symbols: []},
            {name: "b", symbols: ["a"]}
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy).toNotHaveBeenCalled();
    });

    it("doesn't warn about duplicate symbol", function () {
        mockGrammar.rules =  [
            {name: "a", symbols: []},
            {name: "a", symbols: []},
            {name: "b", symbols: ["a"]}
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy).toNotHaveBeenCalled();
    });
})
