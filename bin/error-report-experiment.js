const nearley = require("../lib/nearley");
const grammar = require("../examples/js/csscolor");

main();

function main() {
    const parser = new nearley.Parser(
        nearley.Grammar.fromCompiled(grammar),
        { keepHistory: false }
    );
    try {
        parser.feed("b4d4ss");
        console.log("results", parser.results);
    } catch (e) {
        console.log(e.message);
    }
}
