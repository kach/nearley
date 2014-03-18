var Writable = require('stream').Writable;
var util = require('util');

function Rule(name, symbols, postprocess) {
    if (!(this instanceof Rule)) return new Rule(name, symbols, postprocess);
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

function setup(table, rules, addedRules, start) {
    var w, s;
    table.push([]);
    // I could be expecting anything!
    rules.forEach(function (r) {
        if (r.name === start) {
            addedRules.push(r);
            table[0].push(r.getStartState(0));
        }
    });

    advanceTo(0, table, rules, addedRules);

}

function advanceTo(n, table, rules, addedRules) {
    var w = 0, s;
    while (w < table[n].length) {
        s = table[n][w];
        s.process(table, n, rules, addedRules);
        w++;
    }
}

function Parser(rules, start) {
    Writable.call(this, { decodeStrings: false });
    var table = [];
    var addedRules = [];

    if (!start) {
        start = rules[0];
    }

    setup(table, rules, addedRules, start);

    this.on('finish', finish);

    function finish() {
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
            this.emit('result', considerations[0].data);
        } else {
            this.emit('error', new Error("nearley parse error"));
        }
    }

    this.current = 0;

    this._write = function (chunk, encoding, callback) {
        chunk = chunk.toString();
        for (; this.current < chunk.length; this.current++) {
            // We add new states to table[current+1]
            table.push([]);

            // Advance all tokens that expect the symbol
            // So for each state in the previous row,

            var w = 0, s;
            while (w < table[this.current].length) {
                s = table[this.current][w];
                // Try to consume the token
                var x = s.consume(chunk[this.current]);
                if (x) {
                    // And then add it
                    table[this.current+1].push(x);
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

            advanceTo(this.current+1, table, rules, addedRules);
        }
        callback();
        //console.log("Table:", require('util').inspect(table[table.length-1], {depth:null}));
    }
}

util.inherits(Parser, Writable);

module.exports = {
    Parser: Parser,
    rule: Rule
};
