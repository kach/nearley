var child_process = require('child_process')
  , chai = require('chai')
  , mocha = require('mocha');

var shared = require('./_shared.js');
var compile = shared.compile
  , evalGrammar = shared.evalGrammar
  , parse = shared.parse
  , read = shared.read;

chai.should();

function sh(cmd) {
    return child_process.execSync(cmd, {encoding: 'utf-8', stdio: 'pipe'});
}

function externalNearleyc(args) {
    return sh("node bin/nearleyc.js " + args);
}



describe("nearleyc", function() {
    it('should build test parser (check integrity)', function() {
        externalNearleyc("test/parens.ne -o test/parens.js").should.equal("");
    });

    it('should build for CoffeeScript', function() {
        externalNearleyc("test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee").should.equal("");
        sh("coffee -c test/tmp.coffeescript-test.coffee");
        var grammar = evalGrammar(read("test/tmp.coffeescript-test.js"));
        parse(grammar, "ABCDEFZ12309")
            .should.deep.equal([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('calculator example', function() {
        var arith = compile(read("examples/calculator/arithmetic.ne"));
        parse(arith, "ln (3 + 2*(8/e - sin(pi/5)))")
            .should.deep.equal([ Math.log(3 + 2*(8/Math.exp(1) - Math.sin(Math.PI/5))) ]);
    });

    it('csscolor example', function() {
        var cssc = compile(read("examples/csscolor.ne"));
        parse(cssc, "#FF00FF").should.deep.equal([{r: 0xff, g: 0x00, b: 0xff}]);
        parse(cssc, "#8A7").should.deep.equal([{r: 0x88, g: 0xaa, b: 0x77}]);
        parse(cssc, "rgb(99,66,33)").should.deep.equal([{r: 99, g: 66, b: 33}]);
        parse(cssc, "hsl(99,66,33)").should.deep.equal([{h: 99, s: 66, l: 33}]);
        (function() { parse(cssc, "#badcolor"); }).should.throw(Error);
    });

    it('exponential whitespace bug', function() {
        compile(read('test/indentation.ne'));
    });

    it('nullable whitespace bug', function() {
        var wsb = compile(read("test/whitespace.ne"));
        parse(wsb, "(x)")
            .should.deep.equal(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    it('percent bug', function() {
        compile(read('test/percent.ne'));
    });

    it('tokens', function() {
        var tokc = compile(read("examples/token.ne"));
        parse(tokc, [123, 456, " ", 789]).should.deep.equal([ [123, [ [ 456, " ", 789 ] ]] ]);
    });

    it('leo bug', function() {
        var leo = compile(read("test/leobug.ne"));
        parse(leo, "baab")
            .should.deep.equal(
            [ [ 'b', [], 'a', [], 'a', [ 'b' ] ],
            [ 'b', [], 'a', [], 'a', [ 'b', [] ] ] ]);
    });

    var json;
    it('json example compiles', function() {
        json = compile(read("examples/json.ne"));
    });
    it('json test1', function() {
        var test1 = read('test/test1.json');
        parse(json, test1).should.deep.equal([JSON.parse(test1)]);
    });
    it('json test2', function() {
        var test2 = read('test/test2.json');
        parse(json, test2).should.deep.equal([JSON.parse(test2)]);
    });

    it('tosh example', function() {
        var tosh = compile(read("examples/tosh.ne"));
        parse(tosh, "set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))")
            .should.deep.equal([["setVar:to:","foo",["*",["*",2,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]],["-",1,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]]]]]);
    });

    it('classic crontab', function() {
        // Try compiling the grammar
        var classicCrontab = compile(read("examples/classic_crontab.ne"));
        // Try parsing crontab file using the newly generated parser
        var crontabTest = read('test/classic_crontab.test');
        var crontabResults = read('test/classic_crontab.results');
        parse(classicCrontab, crontabTest).should.deep.equal([JSON.parse(crontabResults)]);
    });
});
