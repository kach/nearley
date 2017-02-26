
var path = require('path');

var Benchmark = require('benchmark');

var Parser = require('../lib/nearley.js').Parser;
var shared = require('./_shared.js');
var compile = shared.compile
  , read = shared.read;


// For making tests

function addTest(parserName, parser, examples) {
    examples.forEach(function(example) {
        var input = example.source;
        suite.add(parserName + ' ' + example.name, function() {
            parser(input);
        });
    })
}

function makeParser(neFile) {
    var grammar;
    try {
        grammar = compile(read(neFile));
    } catch (e) {
        grammar = null; // oh dear
    }

    function parse(input) {
        if (grammar === null) {
            throw 'grammar error';
        }
        var p = new Parser(grammar);
        p.feed(input);
        return p.results;
    }

    return parse;
}

function Example(name, source) {
    this.name = name;
    this.source = source;
}

Example.read = function(filename) {
  return new Example(path.basename(filename), read(filename));
};

// Define benchmarks

var suite = new Benchmark.Suite();

addTest('calculator', makeParser('examples/calculator/arithmetic.ne'), [
    // new Example('arithmetic1', '2 + 3 * 42 - sin(0.14)'),
    new Example('arithmetic2', 'ln (3 + 2*(8/e - sin(pi/5)))'),
]);

addTest('json', makeParser('examples/json.ne'), [
    Example.read('test/sample1k.json'),
]);

addTest('tosh', makeParser('examples/tosh.ne'), [
    new Example('ex1', 'set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))'),
]);



/*
addTest('native JSON.parse', JSON.parse, [
   Example.read('test/test1.json'),
   Example.read('test/test2.json'),
])
*/

// TODO benchmark compile


// Run & report results

suite.on('cycle', function(event) {
    var bench = event.target;
    if (bench.error) {
        console.log('  ✘ ', bench.name);
        console.log(bench.error.stack);
        console.log('');
    } else {
        console.log('  ✔ ' + bench)
    }
})
.on('complete', function() {
    // TODO: report geometric mean.
})
.run();

