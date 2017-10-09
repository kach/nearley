const fs = require("fs");

const nearley = require("../lib/nearley");
const { compile } = require("./_shared");

function read(filename) {
    return fs.readFileSync(filename, "utf-8");
}

function makeParser(neFile) {
    let grammar;
    try {
        grammar = compile(read(neFile));
    } catch (e) {
        grammar = null; // oh dear
    }

    return function parse(input) {
        if (grammar === null) {
            throw "grammar error";
        }
        const p = new nearley.Parser(grammar);
        p.feed(input);
        return p.results;
    };
}

// Define benchmarks

suite("calculator", () => {
    const exampleFile = "ln (3 + 2*(8/e - sin(pi/5)))";

    const parse = makeParser("examples/calculator/arithmetic.ne");
    benchmark("nearley", () => parse(exampleFile));
});

suite("json", () => {
    const jsonFile = read("test/grammars/sample1k.json");

    const parse = makeParser("examples/json.ne");
    benchmark("nearley", () => parse(jsonFile));

    //benchmark('native JSON 😛', () => JSON.parse(jsonFile))
});

suite("tosh", () => {
    const toshFile =
        "set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))";

    const parse = makeParser("examples/tosh.ne");
    benchmark("nearley", () => parse(toshFile));
});
