var nearley = require('../lib/nearley.js');
var parserGrammar = require('./parens.js');
function nspace(n) {
	var out = "";
	for (var i=0; i<n; i++) {
		out += " ";
	}
	return out;
}

function profile(n, type) {
	var test = "";
	for (var i=0; i<n; i++) {
		test += "(";
	}
	test += "acowcowcowcowcowcowcowcowcow";
	for (var i=0; i<n; i++) {
		test += ")";
	}
	var starttime = process.hrtime();
	var startmemory = process.memoryUsage().heapUsed;
	var p = new nearley.Parser(parserGrammar.ParserRules, parserGrammar.ParserStart).feed(test);
	console.assert(p.results[0]);
	switch (type) {
	case "TIME":
		var tdiff = process.hrtime(starttime)[1];
		console.log(
			nspace(Math.round(tdiff/1e9  *80))+"*" // how much of one second
		);
		break;
	case "MEMO":
		var mdiff = process.memoryUsage().heapUsed - startmemory;
		console.log(
			nspace(Math.round(mdiff/1e8  *80)) + "+"
		);
	}
}

console.log("Nearley test.");
console.log("=============");
console.log("Tests operate on the grammar p -> \"(\" p \")\" | [a-z]");
console.log("An input of size n is 2n+1 characters long, and of the form (((...a...))).");
console.log();


console.log("Running time tests.");
console.log("-------------------");
console.log("Each star corresponds to the time taken to parse an input of that size with a recursive grammar.");
console.log();
console.log("SCALE");
console.log(nspace(20) + "0.25s");
console.log(nspace(40) + "0.50s");
console.log(nspace(60) + "0.75s");
console.log(nspace(80) + "1.00s");

for (var i=0; i<5e4; i+=2e3) {
	if (i%1e4 === 0) {
		console.log(i);
	}
	profile(i, "TIME");
}


console.log("Running memory tests.");
console.log("-------------------");
console.log("Each star corresponds to the memory taken to parse an input of that size with a recursive grammar.");
console.log("Occasional outliers may be caused by gc runs. Nearley profiling doesn't explicitly call the gc before each run.");
console.log();
console.log("SCALE");
console.log(nspace(20) + "025MB");
console.log(nspace(40) + "050MB");
console.log(nspace(60) + "075MB");
console.log(nspace(80) + "100MB");

for (var i=0; i<5e4; i+=2e3) {
	if (i%1e4 === 0) {
		console.log(i);
	}
	profile(i, "MEMO");
}
