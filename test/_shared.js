
var fs = require('fs');

var nearley = require('../lib/nearley.js');
var Compile = require('../lib/compile.js');
var parserGrammar = require('../lib/nearley-language-bootstrapped.js');
var generate = require('../lib/generate.js');

function parse(grammar, input) {
    if (grammar.should) {
        grammar.should.have.keys(['ParserRules', 'ParserStart']);
    }
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
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

function evalGrammar(compiledGrammar) {
    var f = new Function('module', compiledGrammar);
    var m = {exports: {}};
    f(m);
    return m.exports;
}

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

module.exports = {
    read: read,
    compile: compile,
    parse: parse,
    evalGrammar: evalGrammar,
};

