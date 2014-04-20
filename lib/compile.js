var inlineRequire = require('../lib/inline-require.js');

function Compile(structure, opts) {
	var un = 0;
	function unique() {
		return "  id" + (++un);
	}

	var outputRules = [];

	function stringifyProductionRule(name, rule) {
		var tokenList = [];

		rule.tokens.forEach(function(token) {
			if (token.type && token.type === 'literal') {
				var str = token.data;
				if (str.length > 1) {
					var rules = str.split("").map(function(d) {
						return {type: 'literal', 'data':d};
					});
					var postprocessor = "function(d) {return d.join('');}";

					var newname = unique();
					stringifyProductionRule(newname, {tokens: rules, postprocessor: postprocessor});
					tokenList.push(JSON.stringify(newname));
				} else if (str.length === 1) {
					tokenList.push(JSON.stringify({ literal: str}));
				}
			} else if (typeof(token) === 'string') {
				if (token !== 'null') tokenList.push(JSON.stringify(token));
            } else if (token instanceof RegExp) {
                tokenList.push(token.toString());
			} else {
                throw new Error("Should never get here");
            }
		});

		tokenList = "[" + tokenList.join(", ") + "]";
		var out = "rules.push(nearley.rule(" + JSON.stringify(name) + ", " + tokenList +
			(rule.postprocessor ? ", " + rule.postprocessor : "") + "));";

		outputRules.push(out);
	}

	var firstName;

	structure.forEach(function(productionRule) {
		if (productionRule.body) {
			outputRules.push(productionRule.body);
		} else {
			var rules = productionRule.rules;
			if (!firstName) firstName = productionRule.name;
			rules.forEach(function(rule) {
				stringifyProductionRule(productionRule.name, rule);
			});
		}
	});


	var output = "";
	var ws = "\n    ";

	output += "// Generated automatically by nearley.\n";
	output += opts.export + " = function() {";

	output += ws + "var nearley = " + inlineRequire(require, '../lib/nearley.js');
	output += ws + "var rules = [];";
	output += ws + "var id = function(a){return a[0];};";
	output += ws;
	output += ws + outputRules.join("\n    ");
	output += ws;
	output += ws + "return new nearley.Parser(rules, " + JSON.stringify(firstName) + ");";

	output += "\n};";

	return output;
}

module.exports = Compile;
