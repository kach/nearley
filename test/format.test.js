const expect = require("expect");

const format = require("../lib/format");

describe("Formatter", function() {

    it("trims lines", function () {
        var source = "   {% %}  ";
        var formattedSource = format.alignProductionRules(source);
        expect(formattedSource).toMatch("{% %}");
    });

    it("aligns comments", function () {
        var source =
            "a -> \"b\" {% %}\n" +
            "{% %}";
        var formattedSource = format.alignProductionRules(source);
        expect(formattedSource).toMatch(
            "a -> \"b\" {% %}\n" +
            "         {% %}");
    });

    it("aligns production rules", function () {
        var source =
            "a -> \"b\"\n" +
            " | \"c\"";
        var formattedSource = format.alignProductionRules(source);
        expect(formattedSource).toMatch(
            "a -> \"b\"\n" +
            "    | \"c\"");
    });

});