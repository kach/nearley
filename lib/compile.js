(function () {
var nearley = require('../lib/nearley.js');

var Compile = function (structure, opts) {
    var un = 0;

    function unique(name) {
        return name + '$' + (++un);
    }

    function joiner(d) {
        return d.join('');
    }

    var outputRules = [];
    var body = []; // @directives list

    function buildProcessedRule(name, rule) {
        var tokenList = [];

        rule.tokens.forEach(function(token) {
            if (token.literal) {
                var str = token.literal;
                if (str.length > 1) {
                    var rules = str.split("").map(function(d) {
                        return {
                            literal: d
                        };
                    });

                    var newname = unique(name);
                    buildProcessedRule(newname, {
                        tokens: rules,
                        postprocess: joiner
                    });
                    tokenList.push(newname);
                } else if (str.length === 1) {
                    tokenList.push({
                        literal: str
                    });
                }
            } else if (typeof(token) === 'string') {
                if (token !== 'null') tokenList.push(token);
            } else if (token instanceof RegExp) {
                tokenList.push(token);
            } else {
                throw new Error("Should never get here");
            }
        });

        var out = new nearley.Rule(name, tokenList, rule.postprocess);

        outputRules.push(out);
    }

    var firstName;

    structure.forEach(function(productionRule) {
        if (productionRule.body) {
            // This isn't a rule, it's an @directive.
            body.push(productionRule.body);
        } else {
            var rules = productionRule.rules;
            if (!firstName) firstName = productionRule.name;
            rules.forEach(function(rule) {
                buildProcessedRule(productionRule.name, rule);
            });
        }
    });

    return {
        rules: outputRules,
        body: body,
        start: firstName
    };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = Compile;
} else {
   window.Compile = Compile;
}
})();