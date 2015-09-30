(function () {
if (typeof(window) === 'undefined') {
    var nearley = require('../lib/nearley.js');
} else {
    var nearley = window.nearley;
}

function Compile(structure, opts) {
    var unique = uniquer();

    var result = {
        rules: [],
        body: [], // @directives list
        config: {}, // @config value
        start: ''
    };

    for (var i = 0; i < structure.length; i++) {
        var productionRule = structure[i];
        if (productionRule.body) {
            // This isn't a rule, it's an @directive.
            if (!opts.nojs) {
                result.body.push(productionRule.body);
            }
        } else if (productionRule.config) {
            // This isn't a rule, it's an @config.
            result.config[productionRule.config] = productionRule.value
        } else {
            produceRules(productionRule.name, productionRule.rules);
            if (!result.start) {
                result.start = productionRule.name;
            }
        }
    }

    return result;

    function produceRules(name, rules) {
        for (var i = 0; i < rules.length; i++) {
            var rule = buildRule(name, rules[i]);
            if (opts.nojs) {
                rule.postprocess = null;
            }
            result.rules.push(rule);
        }
    }

    function buildRule(ruleName, rule) {
        var tokens = [];
        for (var i = 0; i < rule.tokens.length; i++) {
            var token = buildToken(ruleName, rule.tokens[i]);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new nearley.Rule(
            ruleName,
            tokens,
            rule.postprocess
        );
    }

    function buildToken(ruleName, token) {
        if (typeof token === 'string') {
            if (token === 'null') {
                return null;
            }
            return token;
        }

        if (token instanceof RegExp) {
            return token;
        }

        if (token.literal) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1) {
                return token;
            }
            return buildStringToken(ruleName, token);
        }

        if (token.subexpression) {
            return buildSubExpressionToken(ruleName, token);
        }

        if (token.ebnf) {
            return buildEBNFToken(ruleName, token);
        }

        throw new Error("unrecognized token: " + JSON.stringify(token));
    }

    function buildStringToken(ruleName, token) {
        var newname = unique(ruleName + "$string");
        produceRules(newname, [
            {
                tokens: token.literal.split("").map(function charLiteral(d) {
                    return {
                        literal: d
                    };
                }),
                postprocess: {builtin: "joiner"}
            }
        ]);
        return newname;
    }

    function buildSubExpressionToken(ruleName, token) {
        var data = token.subexpression;
        var name = unique(ruleName + "$subexpression");
        structure.push({"name": name, "rules": data});
        return name;
    }

    function buildEBNFToken(ruleName, token) {
        switch (token.modifier) {
            case ":+":
                return buildEBNFPlus(ruleName, token);
            case ":*":
                return buildEBNFStar(ruleName, token);
            case ":?":
                return buildEBNFOpt(ruleName, token);
        }
    }

    function buildEBNFPlus(ruleName, token) {
        var name = unique(ruleName + "$ebnf");
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        return name;
    }

    function buildEBNFStar(ruleName, token) {
        var name = unique(ruleName + "$ebnf");
        structure.push({
            name: name,
            rules: [{
                tokens: [],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        return name;
    }

    function buildEBNFOpt(ruleName, token) {
        var name = unique(ruleName + "$ebnf");
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
                postprocess: {builtin: "id"}
            }, {
                tokens: [],
                postprocess: {builtin: "nuller"}
            }]
        });
        return name;
    }
}

function uniquer() {
    var uns = {};
    return unique;
    function unique(name) {
        var un = uns[name] = (uns[name] || 0) + 1;
        return name + '$' + un;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Compile;
} else {
    window.Compile = Compile;
}
})();
