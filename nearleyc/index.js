
var path = require('path');

var nearley = require('../nearley');

var Compile = require('./compile');
var parserGrammar = nearley.Grammar.fromCompiled(require('./nearley-language-bootstrapped'));
var generate = require('./generate');

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

module.exports = {
    compile: compile,
    evalGrammar: evalGrammar,
    parse: parse,
};

