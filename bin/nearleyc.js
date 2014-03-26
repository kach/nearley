#!/usr/bin/env node

var fs = require('fs');
var nearley = require('../lib/nearley.js');
var inlineRequire = require('../lib/inline-require.js');
var nomnom = require('nomnom');

var opts = nomnom
	.script('nearleyc')
	.option('file', {
		position: 0,
		help: "An input .ne file (if not provided then read from stdin)",
	})
	.option('out', {
		abbr: 'o',
		help: "File to output to (defaults to stdout)",
	})
	.option('export', {
		abbr: 'e',
		help: "Variable to set the parser to",
		default: "module.exports"
	})
	.option('version', {
		abbr: '-v',
		flag: true,
		help: "Print version and exit",
		callback: function() {
			return require('../package.json').version;
		}
	})
	.parse();

function makeParser() {
    var language = require('../lib/nearley-language.js');

	return new nearley.Parser(language.rules, language.start);
}

function Compile(structure) {
	var un = 0;
	function unique() {
		return "  id" + (++un);
	}

	var outputRules = [];
	var outputNonterminals = [];

	initNonterminal("_char");
	initNonterminal("_az");
	initNonterminal("_AZ");
	initNonterminal("_09");
	initNonterminal("_s");

	outputRules.push("rules.push(nearley.rule(nonterminals['_char'], [/./], function(d) {return d[0];}));");
	outputRules.push("rules.push(nearley.rule(nonterminals['_az'], [/[a-z]/], function(d) {return d[0];}));");
	outputRules.push("rules.push(nearley.rule(nonterminals['_AZ'], [/[A-Z]/], function(d) {return d[0];}));");
	outputRules.push("rules.push(nearley.rule(nonterminals['_09'], [/[0-9]/], function(d) {return d[0];}));");
	outputRules.push("rules.push(nearley.rule(nonterminals['_s'], [/\\s/], function(d) {return d[0];}));");

	function stringifyProductionRule(name, rule) {
		var tokenList = [];
		//console.log(name, rule);
		rule.tokens.forEach(function(token) {
			if (token.type && token.type === 'literal') {
				var str = token.data;
				if (str.length > 1) {
					var name = initNonterminal();
					var rules = str.split("").map(function(d) {
						return {type: 'literal', 'data':d};
					});
					var postprocessor = "function(d) {return d.join('');}";

					stringifyProductionRule(name, {tokens: rules, postprocessor: postprocessor});
					tokenList.push(name);
				} else if (str.length === 1) {
					tokenList.push(JSON.stringify(str));
				}
			} else if (typeof(token) === 'string') {
				if (token !== 'null') tokenList.push(nonterminalName(token));
			}
		})

		tokenList = "[" + tokenList.join(", ") + "]";
		var out = "rules.push(nearley.rule(" + name + ", " + tokenList +
			(rule.postprocessor ? ", " + rule.postprocessor : "") + "));";

		outputRules.push(out);
	}
	function initNonterminal(name) {
		var id = name || unique();
		var ref = nonterminalName(id);
		outputNonterminals.push(ref + " = {};");
		return ref;
	}
	function nonterminalName(name) {
		return "nonterminals['" + name + "']";
	}

	structure.forEach(function(productionRule) {
		var name = initNonterminal(productionRule.name);
		var rules = productionRule.rules;

		rules.forEach(function(rule) {
			stringifyProductionRule(name, rule);
		});
	});


	var output = "";
	var ws = "\n    ";

	output += "// Generated automatically by nearley.\n";
	output += opts.export + " = function() {";

	output += ws + "var nearley = " + inlineRequire(require, '../lib/nearley.js');
	output += ws + "var nonterminals = [];";
	output += ws + "var rules = [];";
	output += ws + "var id = function(a){return a[0];};";
	output += ws + outputNonterminals.join("\n    ");
	output += ws;
	output += ws + outputRules.join("\n    ");
	output += ws;
	output += ws + "return new nearley.Parser(rules, nonterminals['" + structure[0].name+ "']);";

	output += "\n};";

	return output;
}

var input = opts.file ? fs.createReadStream(opts.file) : process.stdin;
input.pipe(makeParser()).on('result', function (result) {
    var c = Compile(result);
    if (!opts.out) {
        process.stdout.write(c);
    } else {
        fs.writeFile(opts.out, c);
    }
});
