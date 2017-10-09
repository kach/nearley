const path = require("path");

const nearley = require("../lib/nearley");

const Compile = require("../lib/compile");
const parserGrammar = nearley.Grammar.fromCompiled(
    require("../lib/nearley-language-bootstrapped")
);
const generate = require("../lib/generate");

function parse(grammar, input) {
    const p = new nearley.Parser(grammar);
    p.feed(input);
    return p.results;
}

function nearleyc(source) {
    // parse
    const results = parse(parserGrammar, source);

    // compile
    const c = Compile(results[0], {});

    // generate
    return generate(c, "grammar");
}

function compile(source) {
    const compiledGrammar = nearleyc(source);

    // eval
    return evalGrammar(compiledGrammar);
}

/*
function requireFromString(source) {
    var filename = '.'
    var Module = module.constructor;
    var m = new Module();
    m.paths = Module._nodeModulePaths(path.dirname(filename))
    m._compile(source, filename);
    return m.exports;
}
*/
function requireFromString(source) {
    const module = { exports: null };
    eval(source);
    return module.exports;
}

function evalGrammar(compiledGrammar) {
    const exports = requireFromString(compiledGrammar);
    return new nearley.Grammar.fromCompiled(exports);
}

module.exports = {
    compile: compile,
    nearleyc: nearleyc,
    evalGrammar: evalGrammar,
    parse: parse
};
