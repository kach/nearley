
const fs = require('fs');
const expect = require('expect');

const nearley = require('../lib/nearley');
const {compile, evalGrammar, parse, nearleyc} = require('./_shared');
const {sh, externalNearleyc, cleanup} = require('./external');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

function inspect(grammar) {
  return grammar.rules.map(g => g.toString())
}

describe("bin/nearleyc", function() {
    after(cleanup)

    it('builds for ES5', function() {
        const out = externalNearleyc("grammars/parens.ne", '.js')
        var grammar = nearley.Grammar.fromCompiled(require(`./${out}.js`));
    });

    it('builds for CoffeeScript', function() {
        const out = externalNearleyc("grammars/coffeescript-test.ne", ".coffee")
        sh(`coffee -c ${out}.coffee`);
        var grammar = nearley.Grammar.fromCompiled(require(`./${out}.js`));
        expect(parse(grammar, "ABCDEFZ12309")).toEqual([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('builds for TypeScript', function() {
        this.timeout(10000); // It takes a while to run tsc!
        const out = externalNearleyc("grammars/typescript-test.ne", ".ts")
        sh(`tsc ${out}.ts`);
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
        compile(read('test/grammars/indentation.ne'));
    });

    it('nullable whitespace bug', function() {
        var wsb = compile(read("test/grammars/whitespace.ne"));
        expect(parse(wsb, "(x)")).toEqual(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    it('percent bug', function() {
        compile(read('test/grammars/percent.ne'));
    });

    it('tokens', function() {
        var tokc = compile(read("examples/token.ne"));
        expect(parse(tokc, [123, 456, " ", 789])).toEqual([ [123, [ [ 456, " ", 789 ] ]] ]);
    });

    it('leo bug', function() {
        var leo = compile(read("test/grammars/leobug.ne"));
        expect(parse(leo, "baab")).toEqual(
            [ [ 'b', [], 'a', [], 'a', [ 'b' ] ],
            [ 'b', [], 'a', [], 'a', [ 'b', [] ] ] ]);
    });

    var json;
    it('json example compiles', function() {
        json = compile(read("examples/json.ne"));
    });
    it('json test1', function() {
        var test1 = read('test/grammars/test1.json');
        expect(parse(json, test1)).toEqual([JSON.parse(test1)]);
    });
    it('json test2', function() {
        var test2 = read('test/grammars/test2.json');
        expect(parse(json, test2)).toEqual([JSON.parse(test2)]);
    });

    it('tosh example', function() {
        var tosh = compile(read("examples/tosh.ne"));
        expect(parse(tosh, "set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))"))
            .toEqual([["setVar:to:","foo",["*",["*",2,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]],["-",1,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]]]]]);
    });

    it('classic crontab', function() {
        // Try compiling the grammar
        var classicCrontab = compile(read("examples/classic_crontab.ne"));
        // Try parsing crontab file using the newly generated parser
        var crontabTest = read('test/grammars/classic_crontab.test');
        var crontabResults = read('test/grammars/classic_crontab.results');
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
        var caseinsensitive = compile(read("test/grammars/caseinsensitive.ne"));
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

describe('builtins', () => {

    it('generate includes id', () => {
        const source = nearleyc(`
        X -> "hat" {% id %}
        `)
        expect(source.indexOf('function id(')).toNotBe(-1)
        const g = evalGrammar(source)
        expect(parse(g, "hat")).toEqual(["hat"])
    })

    // TODO fix docs?
    it.skip('nuller', () => {
        //@builtin "postprocessors.ne"
        const source = nearleyc(`
        ws -> " " {% nuller %}
        `)
        const g = evalGrammar(source)
        expect(parse(g, " ")).toEqual([null])
    })
})

describe('macros', () => {

    it('seem to work', () => {
        // Matches "'Hello?' 'Hello?' 'Hello?'"
        const grammar = compile(`
            matchThree[X] -> $X " " $X " " $X
            inQuotes[X] -> "'" $X "'"
            main -> matchThree[inQuotes["Hello?"]]
        `)

        expect(inspect(grammar)).toEqual([
"main$macrocall$2$macrocall$2$string$1 → \"H\" \"e\" \"l\" \"l\" \"o\" \"?\"",
            "main$macrocall$2$macrocall$2 → main$macrocall$2$macrocall$2$string$1",
            "main$macrocall$2$macrocall$1 → \"'\" main$macrocall$2$macrocall$2 \"'\"",
            "main$macrocall$2 → main$macrocall$2$macrocall$1",
            "main$macrocall$1 → main$macrocall$2 \" \" main$macrocall$2 \" \" main$macrocall$2",
            "main → main$macrocall$1",
        ])
    })

    it('must be defined before use', () => {
        expect(() => compile(`
            main -> matchThree[inQuotes["Hello?"]]
            matchThree[X] -> $X " " $X " " $X
            inQuotes[X] -> "'" $X "'"
        `)).toThrow()
    })

})
