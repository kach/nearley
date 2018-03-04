
const fs = require('fs');

const nearley = require('../lib/nearley');
const {compile} = require('./_shared');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

function makeParser(neFile) {
    var grammar;
    try {
        grammar = compile(read(neFile));
    } catch (e) {
        grammar = null; // oh dear
    }

    return function parse(input) {
        if (grammar === null) {
            throw 'grammar error';
        }
        var p = new nearley.Parser(grammar);
        p.feed(input);
        return p.results;
    }
}


// Define benchmarks

/*suite('nearley: parse scannerless-nearley.ne', () => {
  //const nearleyGrammar = read('lib/nearley-language-bootstrapped.ne')
  const nearleyGrammar = read('test/grammars/scannerless-nearley.ne')

  const parseLexer = makeParser('lib/nearley-language-bootstrapped.ne')
  benchmark('current', () => parseLexer(nearleyGrammar))

  const parseScannerless = makeParser('test/grammars/scannerless-nearley.ne')
  benchmark('scannerless', () => parseScannerless(nearleyGrammar))
})

suite('nearley: parse tosh.ne', () => {
  const toshGrammar = read('examples/tosh.ne')

  const parseLexer = makeParser('lib/nearley-language-bootstrapped.ne')
  benchmark('current', () => parseLexer(toshGrammar))

  const parseScannerless = makeParser('test/grammars/scannerless-nearley.ne')
  benchmark('scannerless', () => parseScannerless(toshGrammar))
})*/

suite('calculator: parse', () => {
  const exampleFile = 'ln (3 + 2*(8/e - sin(pi/5)))'

  const parse = makeParser('examples/calculator/arithmetic.ne')
  benchmark('nearley', () => parse(exampleFile))

})

suite('json: parse sample1k', () => {
  const jsonFile = read('test/grammars/sample1k.json')

  const parse = makeParser('examples/json.ne')
  benchmark('nearley', () => parse(jsonFile))

  //benchmark('native JSON 😛', () => JSON.parse(jsonFile))

})

suite('tosh: parse', () => {
  const toshFile = 'set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))'

  const parse = makeParser('examples/tosh.ne')
  benchmark('nearley', () => parse(toshFile))

})

