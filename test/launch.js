var fs = require('fs')
  , child_process = require('child_process')
  , chai = require('chai')
  , mocha = require('mocha');

var nearley = require('../lib/nearley.js');


chai.should();

function sh(cmd) {
    return child_process.execSync(cmd, {encoding: 'utf-8', stdio: 'pipe'});
}

function load(compiledFilename) {
    var f = new Function('module', fs.readFileSync(compiledFilename, 'utf-8'));
    var m = {exports: {}};
    f(m);
    return m.exports;
}

function parse(grammar, input) {
    if (typeof grammar == 'string') grammar = load(grammar);
    grammar.should.have.keys(['ParserRules', 'ParserStart']);
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    return p.feed(input).results;
}

describe("nearleyc", function() {
    it('should build test parser (check integrity)', function() {
        sh("bin/nearleyc.js test/parens.ne -o test/parens.js").should.equal("");
    });

    it('should build for CoffeeScript', function() {
        sh("bin/nearleyc.js test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee");
        sh("coffee -c test/tmp.coffeescript-test.coffee");
        parse("test/tmp.coffeescript-test.js", "ABCDEFZ12309")
            .should.deep.equal([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('exponential whitespace bug', function() {
        sh("bin/nearleyc.js test/indentation.ne");
    });

    it('nullable whitespace bug', function() {
        sh("bin/nearleyc.js test/whitespace.ne -o test/whitespace.js");
        parse("test/whitespace.js", "(x)")
            .should.deep.equal(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    it('percent bug', function() {
        sh("bin/nearleyc.js test/percent.ne");
    });

});

