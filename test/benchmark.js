
var Benchmark = require('benchmark');
var colors = require('colors/safe');

var formatNumber = Benchmark.formatNumber;
var suite = new Benchmark.Suite({
});



// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
.add('String#match', function() {
  !!'Hello World!'.match(/o/);
})

var longestName = Math.max.apply(null, suite.map(function(bench) {
  return bench.name.length;
}));
function padName(x) {
  while (x.length < longestName) {
    x += ' ';
  }
  return x;
}

// add listeners
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
  // console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });

