const fs = require('fs');
const child_process = require('child_process');
const chai = require('chai');
const mocha = require('mocha');

const nearley = require('../nearley');
const {compile} = require('../nearleyc');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}
function parse(grammar, input) {
    var p = new nearley.Parser(grammar);
    p.feed(input);
    return p.results;
}

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
        var grammar = nearley.Grammar.fromCompiled(require("./tmp.coffeescript-test.js"));
        parse(grammar, "ABCDEFZ12309")
            .should.deep.equal([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('should build for TypeScript', function() {
        this.timeout(5000);
        externalNearleyc("test/typescript-test.ne -o test/tmp.typescript-test.ts").should.equal("");
        sh("node ./node_modules/typescript/bin/tsc --project test");
        var grammar = nearley.Grammar.fromCompiled(require("./tmp.typescript-test.js"));
        parse(grammar, "<123>")
            .should.deep.equal([ [ '<', '123', '>' ] ]);
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

    it('parentheses', function() {
        // Try compiling the grammar
        var parentheses = compile(read("examples/parentheses.ne"));
        var passCases = [
            '()',
            '[(){}<>]',
            '[(((<>)()({})())(()())(())[])]',
            '<<[([])]>([(<>[]{}{}<>())[{}[][]{}{}[]<>[]{}<>{}<>[]<>{}()][[][][]()()()]({})<[]>{(){}()<>}(<>[])]())({})>'
        ];

        for (let i in passCases) {
            parse(parentheses, passCases[i]).should.deep.equal([true]);
        }

        var failCases = [
            ' ',
            '[}',
            '[(){}><]',
            '(((())))(()))'
        ];

        for (let i in failCases) {
            (function() { parse(parentheses, failCases[i]); }).should.throw(Error);
        }

        // These are invalid inputs but the parser will not complain
        parse(parentheses, '').should.deep.equal([]);
        parse(parentheses, '((((())))(())()').should.deep.equal([]);
    });

    it('case-insensitive strings', function() {
        var caseinsensitive = compile(read("test/caseinsensitive.ne"));
        var passCases = [
            "Les rêves des amoureux sont comme le bon vin!",
            "LES RÊVES DES AMOUREUX SONT COMME LE BON VIN!",
            "leS RêVeS DeS AmOuReUx sOnT CoMmE Le bOn vIn!",
            "LEs rÊvEs dEs aMoUrEuX SoNt cOmMe lE BoN ViN!"
        ];
        passCases.forEach(function(c) {
            var p = parse(caseinsensitive, c);
            p.length.should.equal(1);
            p[0].toUpperCase().should.equal(passCases[1]);
        });
    });

});

describe('Parser', function() {

    let testGrammar = compile(`
    y -> x:+
    x -> [a-z0-9] | "\\n"
    `)

    it('shows line number in errors', function() {
      (() => parse(testGrammar, 'abc\n12!')).should.throw(
        'invalid syntax at line 2 col 3:\n' +
        '\n' +
        '  12!\n' +
        '    ^'
      )
    })

    it('shows token index in errors', function() {
      (() => parse(testGrammar, ['1', '2', '!'])).should.throw(
        'invalid syntax at index 2'
      )
    })

    var tosh = compile(read("examples/tosh.ne"));

    it('can save state', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        p.current.should.equal(11)
        p.table.length.should.equal(12)
        var col = p.save();
        col.index.should.equal(11)
        col.lexerState.col.should.equal(first.length)
    });

    it('can rewind', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        p.current.should.equal(11)
        p.table.length.should.equal(12)

        p.feed(second);

        p.rewind(first.length);

        p.current.should.equal(11)
        p.table.length.should.equal(12)

        p.results.should.deep.equal([['say:', 'hello']]);
    });

    it("won't rewind without `keepHistory` option", function() {
        let p = new nearley.Parser(tosh, {});
        p.rewind.should.throw();
    })

    it('restores line numbers', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('abc\n')
      p.save().lexerState.line.should.equal(2)
      p.feed('123\n')
      var col = p.save();
      col.lexerState.line.should.equal(3)
      p.feed('q')
      p.restore(col);
      p.lexer.line.should.equal(3)
      p.feed('z')
    });

    it('restores column number', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('foo\nbar')
      var col = p.save();
      col.lexerState.line.should.equal(2)
      col.lexerState.col.should.equal(3)
      p.feed('123');
      p.lexerState.col.should.equal(6)

      p.restore(col);
      p.lexerState.line.should.equal(2)
      p.lexerState.col.should.equal(3)
      p.feed('456')
      p.lexerState.col.should.equal(6)
    });

    // TODO: moo save/restore

});
