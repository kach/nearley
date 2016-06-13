var fs = require('fs')
  , child_process = require('child_process')
  , chai = require('chai')
  , mocha = require('mocha');

var nearley = require('../lib/nearley.js');


chai.should();

function sh(cmd) {
    return child_process.execSync(cmd, {encoding: 'utf-8', stdio: 'pipe'});
}

function nearleyc(args) {
    return sh("node bin/nearleyc.js " + args);
}

function load(compiledGrammar) {
    var f = new Function('module', compiledGrammar);
    var m = {exports: {}};
    f(m);
    return m.exports;
}

function loadFile(compiledFilename) {
    return load(fs.readFileSync(compiledFilename, 'utf-8'));
}

function parse(grammar, input) {
    if (typeof grammar == 'string') {
        if (grammar.match(/\.js$/)) grammar = loadFile(grammar);
        else grammar = load(grammar);
    }
    grammar.should.have.keys(['ParserRules', 'ParserStart']);
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    return p.feed(input).results;
}

describe("nearleyc", function() {
    it('should build test parser (check integrity)', function() {
        nearleyc("test/parens.ne -o test/parens.js").should.equal("");
    });

    it('should build for CoffeeScript', function() {
        nearleyc("test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee").should.equal("");
        sh("coffee -c test/tmp.coffeescript-test.coffee");
        parse("test/tmp.coffeescript-test.js", "ABCDEFZ12309")
            .should.deep.equal([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('calculator example', function() {
        var arith = nearleyc("examples/calculator/arithmetic.ne");
        parse(arith, "ln (3 + 2*(8/e - sin(pi/5)))")
            .should.deep.equal([ Math.log(3 + 2*(8/Math.exp(1) - Math.sin(Math.PI/5))) ]);
    });

    it('csscolor example', function() {
        var cssc = load(nearleyc("examples/csscolor.ne"));
        parse(cssc, "#FF00FF").should.deep.equal([{r: 0xff, g: 0x00, b: 0xff}]);
        parse(cssc, "#8A7").should.deep.equal([{r: 0x88, g: 0xaa, b: 0x77}]);
        parse(cssc, "rgb(99,66,33)").should.deep.equal([{r: 99, g: 66, b: 33}]);
        parse(cssc, "hsl(99,66,33)").should.deep.equal([{h: 99, s: 66, l: 33}]);
        (function() { parse(cssc, "#badcolor"); }).should.throw(Error);
    });

    it('exponential whitespace bug', function() {
        sh("node bin/nearleyc.js test/indentation.ne");
    });

    it('nullable whitespace bug', function() {
        var wsb = nearleyc("test/whitespace.ne");
        parse(wsb, "(x)")
            .should.deep.equal(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    it('percent bug', function() {
        sh("node bin/nearleyc.js test/percent.ne");
    });

    it('tokens', function() {
        var tokc = load(nearleyc("examples/token.ne"));
        parse(tokc, [123, 456, " ", 789]).should.deep.equal([ [123, [ [ 456, " ", 789 ] ]] ]);
    });

});

