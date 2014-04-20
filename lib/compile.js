var inlineRequire = require('../lib/inline-require.js');
var serialize = require('../lib/serialize.js');
var nearley = require('../lib/nearley.js');

function Compile(structure, opts) {
	var un = 0;
	function unique(name) {
		return name + '$' + (++un);
	}

    function joiner(d) {
        return d.join('');
    }

    function id(d) {
        return d[0];
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

					var newname = unique(name);
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

    function variable(v, value) {
        return "var " + assign(v, value);
    }

    function assign(v, value) {
        return v + " = " + value + ";\n";
    }

    function comment(value) {
        return "// " + value + "\n";
    }

    function wrap(body) {
        return "function () {\n" + indent(body) + "}";
    }

    function indent(body) {
        return body.replace(/^/mg, '    ');
    }

    function retn(stmt) {
        return "return " + stmt;
    }

    function call(fn, params) {
        return fn + "(" + params.join(', ') + ");";
    }

	var output = "";

	output += comment("Generated automatically by nearley.");
	output += assign(opts.export, wrap(
        variable('nearley', inlineRequire(require, '../lib/nearley.js')) +
        variable('id', serialize(id)) +
        body.join('\n') +
        "\n" +
        retn(call("new nearley.Parser", [serialize(outputRules), JSON.stringify(firstName)]))
    ));

	return output;
}

module.exports = Compile;
