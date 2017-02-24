
var fs = require('fs');
var path = require('path');
var child_process = require('child_process')

var Benchmark = require('benchmark');
var colors = require('colors/safe');

var formatNumber = Benchmark.formatNumber;
var suite = new Benchmark.Suite();

var Parser = require('../lib/nearley.js').Parser;
var shared = require('./_shared.js');
var compile = shared.compile
  , read = shared.read;


// Define benchmarks

function addTest(parserName, parser, exampleInputs) {
  exampleInputs.forEach(function(inputPath) {
    var input;
    var exampleName;
    if (/^test\//.test(inputPath)) {
        input = read(inputPath);
        exampleName = path.basename(inputPath);
    } else {
        input = inputPath;
        exampleName = '"' + input + '"'
    }
    suite.add(parserName + ': parse ' + exampleName, function() {
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
    var p = new Parser(grammar.ParserRules, grammar.ParserStart);
    p.feed(input)
    return p.results;
  }

  return parse;
}


// TODO benchmark compile


addTest('calculator example', makeParser('examples/calculator/arithmetic.ne'), [
    '2 + 3 * 42 - sin(0.14)',
    'ln (3 + 2*(8/e - sin(pi/5)))',
]);

addTest('json example', makeParser('examples/json.ne'), [
  'test/test1.json',
  'test/test2.json',
]);

/*
addTest('native JSON.parse', JSON.parse, [
  read('test/test1.json'),
  read('test/test2.json'),
])
*/


// Run & report results

var longestName = Math.max.apply(null, suite.map(function(bench) {
  return bench.name.length;
}));
function padName(x) {
  while (x.length < longestName) {
    x += ' ';
  }
  return x;
}

suite.on('cycle', function(event) {
  var bench = event.target;
  var stats = bench.stats;
  var hz = bench.hz; // Hz -- ops per sec
  var pm = '\xb1';

  if (bench.error) {
    console.log(colors.red("✘"), bench.name);
    console.log(colors.red(bench.error.stack));
    console.log('');
  } else {
    var opsPerSec = formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec ' + pm + stats.rme.toFixed(2) + '%';
    console.log(colors.green("✔"), padName(bench.name), colors.blue(opsPerSec));
  }
})
.on('complete', function() {
  // TODO: report geometric mean.
})
.run();

