
var fs = require('fs');
var path = require('path');
var child_process = require('child_process')

var Benchmark = require('benchmark');
var colors = require('colors/safe');

var formatNumber = Benchmark.formatNumber;
var suite = new Benchmark.Suite();

var nearley = require('../lib/nearley.js');



function read(path) {
  return fs.readFileSync(path, 'utf-8')
}


/* from launch.js --TODO share code? */
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
    return load(read(compiledFilename));
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


// Define benchmarks

function addTest(parserName, parser, exampleInputs) {
  exampleInputs.forEach(function(inputPath) {
    var input = read(inputPath);

    suite.add(parserName + ': parse ' + path.basename(inputPath), function() {
      parser(input);
    });
  })
}

function makeParser(neFile) {
  var grammar;
  try {
    var out = nearleyc(neFile);
    grammar = load(out);
  } catch (e) {
    grammar = null; // oh dear
  }

  function parse(input) {
    if (grammar === null) {
      throw 'grammar error';
    }
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    return p.feed(input).results;
  }

  return parse;
}


// TODO benchmark nearleyc [without using sh!]

addTest('json example', makeParser('examples/json.ne'), [
  'test/test1.json',
  'test/test2.json',
])

addTest('native JSON.parse', JSON.parse, [
  'test/test1.json',
  'test/test2.json',
])


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
  } else {
    var opsPerSec = formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec ' + pm + stats.rme.toFixed(2) + '%';
    console.log(colors.green("✔"), padName(bench.name), colors.blue(opsPerSec));
  }
})
.on('complete', function() {
  // TODO: report geometric mean.
})
.run();

