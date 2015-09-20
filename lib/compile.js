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
        start: ''
    };

    for (var i = 0; i < structure.length; i++) {
        var productionRule = structure[i];
        if (productionRule.body) {
            // This isn't a rule, it's an @directive.
            if (!opts.nojs) {
                result.body.push(productionRule.body);
            }
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
            if (token) {
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
        if (token.literal) {
            var str = token.literal;
            if (str.length > 1) {
                var rules = str.split("").map(function(d) {
                    return {
                        literal: d
                    };
                });

                var newname = unique(ruleName + "$string");
                produceRules(newname, [
                    {
                        tokens: rules,
                        postprocess: joiner
                    }
                ]);
                return newname;
            } else if (str.length === 1) {
                return {
                    literal: str
                };
            }
        } else if (token.subexpression) {
            var data = token.subexpression;
            var name = unique(ruleName + "$subexpression");
            structure.push({"name": name, "rules": data});
            return name;
        } else if (token.ebnf) {
            var data = token.ebnf;
            var modifier = token.modifier;
            var name = unique(ruleName + "$ebnf");

            switch (modifier) {
                case ":+":
                    structure.push({
                        "name": name,
                        "rules": [{
                            "tokens": [data],
                        }, {
                            "tokens": [data, name],
                            "postprocess": arrconcat
                        }]
                    });
                    return name;
                case ":*":
                    structure.push({
                        "name": name,
                        "rules": [{
                            "tokens": [],
                        }, {
                            "tokens": [data, name],
                            "postprocess": arrconcat
                        }]
                    });
                    return name;
                case ":?":
                    structure.push({
                        "name": name,
                        "rules": [{
                            "tokens": [data],
                            "postprocess": "id"
                        }, {
                            "tokens": [],
                            "postprocess": "function(d) {return null;}"
                        }]
                    });
                    return name;
            }
        } else if (typeof(token) === 'string') {
            if (token !== 'null') return token;
        } else if (token instanceof RegExp) {
            return token;
        } else {
            throw new Error("Should never get here");
        }
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

function arrconcat(d) {
    return [d[0]].concat(d[1]);
}

function joiner(d) {
    return d.join('');
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Compile;
} else {
    window.Compile = Compile;
}
})();
