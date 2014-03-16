function Rule(name, symbols, postprocess) {
    this.name = name;
    this.symbols = symbols;
    this.postprocess = postprocess || function(a){return a};
}

Rule.prototype.getStartState = function(location) {
    return new State(this, 0, location);
}

function State(rule, expect, reference) {
    this.rule = rule;
    this.expect = expect;
    this.reference = reference;
    this.data = [];
}

State.prototype.consume = function(inp) {
    var rem = typeof inp === 'string' && this.rule.symbols[this.expect] && this.rule.symbols[this.expect].test && this.rule.symbols[this.expect].test(inp);
    if (rem || this.rule.symbols[this.expect] === inp) {
        var a = new State(this.rule, this.expect+1, this.reference);

        a.data = this.data.slice(0);
        a.data.push(inp);
        return a;
    } else {
        return false;
    }
};

State.prototype.process = function(table, location, rules, addedRules) {
    if (this.expect === this.rule.symbols.length) {
        // I have completed a rule
        this.data = this.rule.postprocess(this.data);
        var me = this;
        var w = 0;
        // We need a while here because the empty rule will
        // modify table[reference].
        while (w < table[this.reference].length) {
            var s = table[this.reference][w];
            var x = s.consume(me.rule.name);
            if (x) {
                x.data[x.data.length-1] = me.data;
                table[location].push(x);
            }
            w++;
        }
    } else {
        // I'm not done, but I can predict something
        var exp = this.rule.symbols[this.expect];

        // for each rule
        rules.forEach(function(r) {
            // if I expect it, and it hasn't been added already
            if (r.name === exp && addedRules.indexOf(r) === -1) {
                addedRules.push(r);
                var n = r.getStartState(location);
                table[location].push(n);
            }
        });
    }
}

function Parse(tokens, rules, start) {
    var table = [];
    var addedRules = [];
    function setup() {
        var w, s;
        if (!start) {
            start = rules[0];
        }
        table.push([]);
        // I could be expecting anything!
        rules.forEach(function (r) {
            if (r.name === start) {
                addedRules.push(r);
                table[0].push(r.getStartState(0));
            }
        });

        w = 0;
        while (w < table[0].length) {
            s = table[0][w];
            s.process(table, 0, rules, addedRules);
            w++;
        }
    }

    setup();

    var w, s;

    for (var current = 0; current < tokens.length; current++) {
        // We add new states to table[current+1]
        table.push([]);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        w = 0;
        while (w < table[current].length) {
            s = table[current][w];
            // Try to consume the token
            var x = s.consume(tokens[current]);
            if (x) {
                // And then add it
                table[current+1].push(x);
            }
            w++;
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the
        //     reference row expected that rule
        // (b) predict the next nonterminal it expects
        //     by adding that nonterminal's start state

        // To prevent duplication, we keep track
        // of rules we have already added
        addedRules = [];

        w = 0;
        while (w < table[current+1].length) {
            s = table[current+1][w];
            s.process(table, current+1, rules, addedRules);
            w++;
        }
    }
    //console.log("Table:", require('util').inspect(table[table.length-1], {depth:null}));

    var considerations = [];
    table[table.length-1].forEach(function (t) {
        if (t.rule.name === start && t.expect === t.rule.symbols.length && t.reference === 0) {
            considerations.push(t);
        }
    });
    if (considerations.length > 1) {
        //console.warn("The grammar is ambiguous.");
    }

    if (considerations[0]) {
        return considerations[0].data;
    } else {
        throw "nearley parse error";
    }
}

module.exports = {
    parse: Parse,
    rule: Rule
};
