
const fs = require('fs');
const nearley = require('../nearley');
const {compile} = require('../nearleyc');
const {sh, externalNearleyc, cleanup} = require('./external');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}
function parse(grammar, input) {
    var p = new nearley.Parser(grammar);
    p.feed(input);
    return p.results;
}


describe("bin/nearleyc", function() {
    afterAll(cleanup)

    it.concurrent('should build test parser (check integrity)', async function() {
        const out = await externalNearleyc("parens.ne", '.js')
        nearley.Grammar.fromCompiled(require(`./${out}.js`))
    });

    it.concurrent('should build for CoffeeScript', async function() {
        const out = await externalNearleyc("coffeescript-test.ne", ".coffee")
        await sh(`coffee -c ${out}.coffee`)
        var grammar = nearley.Grammar.fromCompiled(require(`./${out}.js`))
        expect(parse(grammar, "ABCDEFZ12309")).toEqual([ [ 'ABCDEFZ', '12309' ] ])
    });

    it.concurrent('should build for TypeScript', async function() {
        const out = await externalNearleyc("typescript-test.ne", ".ts")
        await sh(`tsc ${out}.ts`);
        var grammar = nearley.Grammar.fromCompiled(require(`./${out}.js`));
        expect(parse(grammar, "<123>")).toEqual([ [ '<', '123', '>' ] ]);
    });

})

describe('nearleyc', function() {

    it('calculator example', function() {
        var arith = compile(read("examples/calculator/arithmetic.ne"));
        expect(parse(arith, "ln (3 + 2*(8/e - sin(pi/5)))")).toEqual([ Math.log(3 + 2*(8/Math.exp(1) - Math.sin(Math.PI/5))) ]);
    });

    it('csscolor example', function() {
        var cssc = compile(read("examples/csscolor.ne"));
        expect(parse(cssc, "#FF00FF")).toEqual([{r: 0xff, g: 0x00, b: 0xff}]);
        expect(parse(cssc, "#8A7")).toEqual([{r: 0x88, g: 0xaa, b: 0x77}]);
        expect(parse(cssc, "rgb(99,66,33)")).toEqual([{r: 99, g: 66, b: 33}]);
        expect(parse(cssc, "hsl(99,66,33)")).toEqual([{h: 99, s: 66, l: 33}]);
        expect(function() { parse(cssc, "#badcolor"); }).toThrow()
    });

    it('exponential whitespace bug', function() {
        compile(read('test/indentation.ne'));
    });

    it('nullable whitespace bug', function() {
        var wsb = compile(read("test/whitespace.ne"));
        expect(parse(wsb, "(x)")).toEqual(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    it('percent bug', function() {
        compile(read('test/percent.ne'));
    });

    it('tokens', function() {
        var tokc = compile(read("examples/token.ne"));
        expect(parse(tokc, [123, 456, " ", 789])).toEqual([ [123, [ [ 456, " ", 789 ] ]] ]);
    });

    it('leo bug', function() {
        var leo = compile(read("test/leobug.ne"));
        expect(parse(leo, "baab")).toEqual(
            [ [ 'b', [], 'a', [], 'a', [ 'b' ] ],
            [ 'b', [], 'a', [], 'a', [ 'b', [] ] ] ]);
    });

    var json;
    it('json example compiles', function() {
        json = compile(read("examples/json.ne"));
    });
    it('json test1', function() {
        var test1 = read('test/test1.json');
        expect(parse(json, test1)).toEqual([JSON.parse(test1)]);
    });
    it('json test2', function() {
        var test2 = read('test/test2.json');
        expect(parse(json, test2)).toEqual([JSON.parse(test2)]);
    });

    it('tosh example', () => {
        var tosh = compile(read("examples/tosh.ne"));
        expect(parse(tosh, "set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))"))
            .toEqual([["setVar:to:","foo",["*",["*",2,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]],["-",1,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]]]]]);
    });

    it('classic crontab', function() {
        // Try compiling the grammar
        var classicCrontab = compile(read("examples/classic_crontab.ne"));
        // Try parsing crontab file using the newly generated parser
        var crontabTest = read('test/classic_crontab.test');
        var crontabResults = read('test/classic_crontab.results');
        expect(parse(classicCrontab, crontabTest)).toEqual([JSON.parse(crontabResults)]);
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
            expect(parse(parentheses, passCases[i])).toEqual([true]);
        }

        var failCases = [
            ' ',
            '[}',
            '[(){}><]',
            '(((())))(()))'
        ];

        for (let i in failCases) {
            expect(function() { parse(parentheses, failCases[i]); }).toThrow()
        }

        // These are invalid inputs but the parser will not complain
        expect(parse(parentheses, '')).toEqual([]);
        expect(parse(parentheses, '((((())))(())()')).toEqual([]);
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
            expect(p.length).toBe(1)
            expect(p[0].toUpperCase()).toBe(passCases[1]);
        });
    });

});

describe('Parser', function() {

    let testGrammar = compile(`
    y -> x:+
    x -> [a-z0-9] | "\\n"
    `)

    it('shows line number in errors', function() {
      expect(() => parse(testGrammar, 'abc\n12!')).toThrow(
        'invalid syntax at line 2 col 3:\n' +
        '\n' +
        '  12!\n' +
        '    ^'
      )
    })

    it('shows token index in errors', function() {
      expect(() => parse(testGrammar, ['1', '2', '!'])).toThrow(
        'invalid syntax at index 2'
      )
    })

    var tosh = compile(read("examples/tosh.ne"));

    it('can save state', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)
        var col = p.save();
        expect(col.index).toBe(11)
        expect(col.lexerState.col).toBe(first.length)
    });

    it('can rewind', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)

        p.feed(second);

        p.rewind(first.length);

        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)

        expect(p.results).toEqual([['say:', 'hello']]);
    });

    it("won't rewind without `keepHistory` option", function() {
        let p = new nearley.Parser(tosh, {});
        expect(() => p.rewind()).toThrow()
    })

    it('restores line numbers', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('abc\n')
      expect(p.save().lexerState.line).toBe(2)
      p.feed('123\n')
      var col = p.save();
      expect(col.lexerState.line).toBe(3)
      p.feed('q')
      p.restore(col);
      expect(p.lexer.line).toBe(3)
      p.feed('z')
    });

    it('restores column number', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('foo\nbar')
      var col = p.save();
      expect(col.lexerState.line).toBe(2)
      expect(col.lexerState.col).toBe(3)
      p.feed('123');
      expect(p.lexerState.col).toBe(6)

      p.restore(col);
      expect(p.lexerState.line).toBe(2)
      expect(p.lexerState.col).toBe(3)
      p.feed('456')
      expect(p.lexerState.col).toBe(6)
    });

    // TODO: moo save/restore

});
