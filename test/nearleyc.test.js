
const fs = require('fs');
const expect = require('expect');

const nearley = require('../lib/nearley');
const {compile, evalGrammar, parse, nearleyc} = require('./_shared');
const {sh, externalNearleyc, cleanup} = require('./external');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

function prettyPrint(grammar) {
  return grammar.rules.map(g => g.toString())
}

describe("bin/nearleyc", function() {
    after(cleanup)

    it('builds for ES5', function() {
        const {outPath, stdout, stderr} = externalNearleyc("grammars/parens.ne", '.js');
        expect(stderr).toBe("");
        expect(stdout).toBe("");
        const grammar = nearley.Grammar.fromCompiled(require(`./${outPath}.js`));
    });

    it('builds for CoffeeScript', function() {
        const {outPath, stdout, stderr} = externalNearleyc("grammars/coffeescript-test.ne", ".coffee");
        expect(stderr).toBe("");
        expect(stdout).toBe("");
        sh(`coffee -c ${outPath}.coffee`);
        const grammar = nearley.Grammar.fromCompiled(require(`./${outPath}.js`));
        expect(parse(grammar, "ABCDEFZ12309")).toEqual([ [ 'ABCDEFZ', '12309' ] ]);
    });

    it('builds for TypeScript', function() {
        this.timeout(10000); // It takes a while to run tsc!
        const {outPath, stdout, stderr} = externalNearleyc("grammars/typescript-test.ne", ".ts");
        expect(stderr).toBe("");
        expect(stdout).toBe("");
        sh(`tsc ${outPath}.ts`);
        const grammar = nearley.Grammar.fromCompiled(require(`./${outPath}.js`));
        expect(parse(grammar, "<123>")).toEqual([ [ '<', '123', '>' ] ]);
    });

    it('builds modules in folders', function() {
        const {outPath, stdout, stderr} = externalNearleyc("grammars/folder-test.ne", '.js');
        expect(stderr).toBe("");
        expect(stdout).toBe("");
        const grammar = nearley.Grammar.fromCompiled(require(`./${outPath}.js`));
    });

    it('builds modules with multiple includes of the same file', function() {
        const {outPath, stdout, stderr} = externalNearleyc("grammars/multi-include-test.ne", '.js');
        expect(stderr).toBe("");
        expect(stdout).toBe("");
        const grammar = nearley.Grammar.fromCompiled(require(`./${outPath}.js`));
    });

    it("warns about undefined symbol", function () {
        const {stdout, stderr} = externalNearleyc("grammars/warning-undefined-test.ne", '.js');
        expect(stderr).toNotBe("");
        expect(stdout).toBe("");
    });

    it("doesn't warn when used with the --quiet option", function () {
        const {stdout, stderr} = externalNearleyc("grammars/warning-undefined-test.ne", '.js', ['--quiet']);
        expect(stderr).toBe("");
        expect(stdout).toBe("");
    });


})

describe('nearleyc: example grammars', function() {

    it('calculator example', function() {
        const arith = compile(read("examples/calculator/arithmetic.ne"));
        expect(parse(arith, "ln (3 + 2*(8/e - sin(pi/5)))")).toEqual([ Math.log(3 + 2*(8/Math.exp(1) - Math.sin(Math.PI/5))) ]);
    });

    it('csscolor example', function() {
        const cssc = compile(read("examples/csscolor.ne"));
        expect(parse(cssc, "#FF00FF")).toEqual([{r: 0xff, g: 0x00, b: 0xff}]);
        expect(parse(cssc, "#8A7")).toEqual([{r: 0x88, g: 0xaa, b: 0x77}]);
        expect(parse(cssc, "rgb(99,66,33)")).toEqual([{r: 99, g: 66, b: 33}]);
        expect(parse(cssc, "hsl(99,66,33)")).toEqual([{h: 99, s: 66, l: 33}]);
        expect(function() { parse(cssc, "#badcolor"); }).toThrow()
    });

    it('exponential whitespace bug', function() {
        compile(read('test/grammars/indentation.ne'));
    });

    it('percent bug', function() {
        compile(read('test/grammars/percent.ne'));
    });

    it('json', function() {
        const grammar = compile(read("examples/json.ne"));
        expect(prettyPrint(grammar)).toEqual([
            'json$subexpression$1 → object',
            'json$subexpression$1 → array',
            'json → _ json$subexpression$1 _',
            'object → "{" _ "}"',
            'object$ebnf$1 → ',
            'object$ebnf$1$subexpression$1 → _ "," _ pair',
            'object$ebnf$1 → object$ebnf$1 object$ebnf$1$subexpression$1',
            'object → "{" _ pair object$ebnf$1 _ "}"',
            'array → "[" _ "]"',
            'array$ebnf$1 → ',
            'array$ebnf$1$subexpression$1 → _ "," _ value',
            'array$ebnf$1 → array$ebnf$1 array$ebnf$1$subexpression$1',
            'array → "[" _ value array$ebnf$1 _ "]"',
            'value → object',
            'value → array',
            'value → number',
            'value → string',
            'value → "true"',
            'value → "false"',
            'value → "null"',
            'number → %number',
            'string → %string',
            'pair → key _ ":" _ value',
            'key → string',
            '_ → ',
            '_ → %space',
        ])
    });

    it('classic crontab', function() {
        // Try compiling the grammar
        const classicCrontab = compile(read("examples/classic_crontab.ne"));
        // Try parsing crontab file using the newly generated parser
        const crontabTest = read('test/grammars/classic_crontab.test');
        const crontabResults = read('test/grammars/classic_crontab.results');
        expect(parse(classicCrontab, crontabTest)).toEqual([JSON.parse(crontabResults)]);
    });

    it('case-insensitive strings', function() {
        const caseinsensitive = compile(read("test/grammars/caseinsensitive.ne"));
        const passCases = [
            "Les rêves des amoureux sont comme le bon vin!",
            "LES RÊVES DES AMOUREUX SONT COMME LE BON VIN!",
            "leS RêVeS DeS AmOuReUx sOnT CoMmE Le bOn vIn!",
            "LEs rÊvEs dEs aMoUrEuX SoNt cOmMe lE BoN ViN!"
        ];
        passCases.forEach(function(c) {
            const p = parse(caseinsensitive, c);
            expect(p.length).toBe(1)
            expect(p[0].toUpperCase()).toBe(passCases[1]);
        });
    });

});

describe('nearleyc: builtins', () => {

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

describe('nearleyc: macros', () => {

    it('seems to work', () => {
        // Matches "'Hello?' 'Hello?' 'Hello?'"
        const grammar = compile(`
            matchThree[X] -> $X " " $X " " $X
            inQuotes[X] -> "'" $X "'"
            main -> matchThree[inQuotes["Hello?"]]
        `);

        expect(prettyPrint(grammar)).toEqual([
            'main$macrocall$2$macrocall$2$string$1 → "H" "e" "l" "l" "o" "?"',
            'main$macrocall$2$macrocall$2 → main$macrocall$2$macrocall$2$string$1',
            'main$macrocall$2$macrocall$1 → "\'" main$macrocall$2$macrocall$2 "\'"',
            'main$macrocall$2 → main$macrocall$2$macrocall$1',
            'main$macrocall$1 → main$macrocall$2 " " main$macrocall$2 " " main$macrocall$2',
            'main → main$macrocall$1',
        ]);
    });

    it('must be defined before use', () => {
        expect(() => compile(`
            main -> matchThree[inQuotes["Hello?"]]
            matchThree[X] -> $X " " $X " " $X
            inQuotes[X] -> "'" $X "'"
        `)).toThrow();
    });

    it('compiles a simple macro from external file', function() {
        const grammar = compile(read("test/grammars/macro-test.ne"));
        const passCases = [
            "a",
            "b",
            "a/b",
            "b/a",
        ];
        passCases.forEach(function(c) {
            const p = parse(grammar, c);
            expect(p.length).toBe(1);
            expect(p[0]).toBe("a/b");
        });
        expect(() => parse(grammar, "ab")).toThrow();
    });

})
