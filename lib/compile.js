(function () {
if (typeof(window) === 'undefined') {
    var nearley = require('../lib/nearley.js');
} else {
    var nearley = window.nearley;
}

function Compile(structure, opts) {
    var unique = uniquer();

    var outputRules = [];
    var body = []; // @directives list
    var config = {}; // @config value

    function buildProcessedRule(ruleName, rule) {
        var tokens = [];

        rule.tokens.forEach(function(token) {
            if (token.literal) {
                var str = token.literal;
                if (str.length > 1) {
                    var rules = str.split("").map(function(d) {
                        return {
                            literal: d
                        };
                    });

                    var newname = unique(ruleName + "$string");
                    buildProcessedRule(newname, {
                        tokens: rules,
                        postprocess: joiner
                    });
                    tokens.push(newname);
                } else if (str.length === 1) {
                    tokens.push({
                        literal: str
                    });
                }
            } else if (token.subexpression) {
                var data = token.subexpression;
                var name = unique(ruleName + "$subexpression");
                structure.push({"name": name, "rules": data});
                tokens.push(name);
            } else if (token.ebnf) {
                var data = token.ebnf;
                var modifier = token.modifier;
                var name = unique(ruleName + "$ebnf");

                switch (modifier) {
                    case ":+":
                        structure.push({
                            name: name,
                            rules: [{
                                tokens: [data],
                            }, {
                                tokens: [data, name],
                                postprocess: arrconcat
                            }]
                        });
                        tokens.push(name);
                        break;
                    case ":*":
                        structure.push({
                            name: name,
                            rules: [{
                                tokens: [],
                            }, {
                                tokens: [data, name],
                                postprocess: arrconcat
                            }]
                        });
                        tokens.push(name);
                        break;
                    case ":?":
                        structure.push({
                            name: name,
                            rules: [{
                                tokens: [data],
                                postprocess: "id"
                            }, {
                                tokens: [],
                                postprocess: "function(d) {return null;}"
                            }]
                        });
                        tokens.push(name);
                        break;
                }
            } else if (typeof token === 'string') {
                if (token !== 'null') tokens.push(token);
            } else if (token instanceof RegExp) {
                tokens.push(token);
            } else {
                throw new Error("Should never get here");
            }
        });

        var out = new nearley.Rule(
            ruleName,
            tokens,
            (opts.nojs ? null : rule.postprocess)
        );

        outputRules.push(out);
    }

    var firstName;

    for (var i = 0; i < structure.length; i++) {
        var productionRule = structure[i];
        if (productionRule.body) {
            // This isn't a rule, it's an @directive.
            if (!opts.nojs) body.push(productionRule.body);
        } else if(productionRule.config) {
            // This isn't a rule, it is an @config
            config[productionRule.config] = productionRule.value
        } else {
            var rules = productionRule.rules;
            if (!firstName) firstName = productionRule.name;
            rules.forEach(function(rule) {
                buildProcessedRule(productionRule.name, rule);
            });
        }
    }

    return {
        rules: outputRules,
        body: body,
        config: config,
        start: firstName
    };
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
