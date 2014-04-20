var inlineRequire = require('../lib/inline-require.js');
var serialize = require('../lib/serialize.js');
var nearley = require('../lib/nearley.js');

function Compile(structure, opts) {
	var un = 0;
	function unique() {
		return "  id" + (++un);
	}

    function joiner(d) {
        return d.join('');
    }

	var outputRules = [];
    var body = [];

	function buildProcessedRule(name, rule) {
		var tokenList = [];

		rule.tokens.forEach(function(token) {
			if (token.type && token.type === 'literal') {
				var str = token.data;
				if (str.length > 1) {
					var rules = str.split("").map(function(d) {
						return { literal: d };
					});

					var newname = unique();
					buildProcessedRule(newname, {tokens: rules, postprocessor: joiner});
					tokenList.push(newname);
				} else if (str.length === 1) {
					tokenList.push({ literal: str });
				}
			} else if (typeof(token) === 'string') {
				if (token !== 'null') tokenList.push(token);
            } else if (token instanceof RegExp) {
                tokenList.push(token);
			} else {
                throw new Error("Should never get here");
            }
		});

		var out = nearley.rule(name, tokenList, rule.postprocessor);

		outputRules.push(out);
	}

	var firstName;

	structure.forEach(function(productionRule) {
		if (productionRule.body) {
			body.push(productionRule.body);
		} else {
			var rules = productionRule.rules;
			if (!firstName) firstName = productionRule.name;
			rules.forEach(function(rule) {
				buildProcessedRule(productionRule.name, rule);
			});
		}
	});


	var output = "";
	var ws = "\n    ";

	output += "// Generated automatically by nearley.\n";
	output += opts.export + " = function() {";

	output += ws + "var nearley = " + inlineRequire(require, '../lib/nearley.js');
	output += ws + "var id = function(a){return a[0];};";
	output += ws;
    body.forEach(function (stmt) {
        output += ws + stmt;
    });
    output += ws + "var rules = " + serialize(outputRules);
	output += ws;
	output += ws + "return new nearley.Parser(rules, " + JSON.stringify(firstName) + ");";

	output += "\n};";

	return output;
}

module.exports = Compile;
