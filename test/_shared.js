
var fs = require('fs');
var path = require('path');

var nearley = require('../lib/nearley.js');
var Compile = require('../lib/compile.js');
var parserGrammar = nearley.Grammar.fromCompiled(require('../lib/nearley-language-bootstrapped.js'));
var generate = require('../lib/generate.js');

function parse(grammar, input) {
    var p = new nearley.Parser(grammar);
    p.feed(input);
    return p.results;
}

function compile(source) {
    // parse
    var results = parse(parserGrammar, source);

    // compile
    var c = Compile(results[0], {});

    // generate
    var compiledGrammar = generate(c, 'grammar');

    // eval
    return evalGrammar(compiledGrammar);
}

function requireFromString(source) {
    var filename = '.'
    var Module = module.constructor;
    var m = new Module();
    m.paths = Module._nodeModulePaths(path.dirname(filename))
    m._compile(source, filename);
    return m.exports;
}

function evalGrammar(compiledGrammar) {
    var exports = requireFromString(compiledGrammar);
    return new nearley.Grammar.fromCompiled(exports);
}

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

module.exports = {
    nearley: nearley,
    read: read,
    compile: compile,
    parse: parse,
    evalGrammar: evalGrammar,
};

