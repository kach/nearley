function Rule(name, symbols, postprocess) {
    return { name: name, symbols: symbols, postprocess: postprocess };
}

function State(rule, expect, reference) {
    this.rule = rule;
    this.expect = expect;
    this.reference = reference;
    this.data = [];
}

State.prototype.toString = function() {
    var predot = this.rule.symbols.slice(0, this.expect).map(stringify).join(' ');

    return ["{", this.rule.name, "→", predot, "●"].concat(this.rule.symbols.slice(this.expect).map(stringify)).concat(["}," + (this.reference || 0)]).filter(id).join(' ');

    function stringify (e) {
        if (e.literal) {
            return JSON.stringify(e.literal);
        } else {
            return e.toString();
        }
    }

    function id(e) {
        return e;
    }
};

State.prototype.nextState = function(data) {
    var state = new State(this.rule, this.expect + 1, this.reference);
    state.data = this.data.slice(0);
    state.data.push(data);
    return state;
};

State.prototype.consume = function(inp) {
    var rem = typeof inp === 'string' && this.rule.symbols[this.expect] && this.rule.symbols[this.expect].test && this.rule.symbols[this.expect].test(inp);
    if (rem || (this.rule.symbols[this.expect] && this.rule.symbols[this.expect].literal === inp)) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.consumeRule = function(inp) {
    if (this.rule.symbols[this.expect] === inp) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.process = function(table, location, rules, addedRules) {
    if (this.expect === this.rule.symbols.length) {
        // I have completed a rule
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference);
        }
        var w = 0;
        // We need a while here because the empty rule will
        // modify table[reference]. (when location === reference)
        var s,x;
        while (w < table[this.reference].length) {
            s = table[this.reference][w];
            x = s.consumeRule(this.rule.name);
            if (x) {
                x.data[x.data.length-1] = this.data;
                table[location].push(x);
            }
            w++;
        }
    } else {
        // I'm not done, but I can predict something
        var exp = this.rule.symbols[this.expect];

        // for each rule
        var me = this;
        rules.forEach(function(r) {
            // if I expect it, and it hasn't been added already
            if (r.name === exp && addedRules.indexOf(r) === -1) {
                // Make a note that you've
                // added it already, and
                // don't need to add it again; otherwise
                // left recursive rules are going to
                // go into an infinite loop
                // by adding themselves over and
                // over again.

                // If it's the null rule, however,
                // you don't do this because it
                // affects the current table row,
                // so you might need it to be
                // called again later.
                // Instead, I just insert a copy whose
                // state has been advanced one position
                // (since that's all the null rule means
                // anyway)
                if (r.symbols.length > 0) {
                    addedRules.push(r);
                    table[location].push(new State(r, 0, location));
                } else {
                    // Empty rule
                    // This is special
                    var copy = me.consumeRule(r.name);
                    if (r.postprocess) {
                        copy.data[copy.data.length-1] = r.postprocess([], this.reference);
                    } else {
                        copy.data[copy.data.length-1] = [];
                    }
                    table[location].push(copy);
                }
            }
        });
    }
};

function advanceTo(n, table, rules, addedRules) {
    // Advance a table
    var w = 0, s;
    while (w < table[n].length) {
        s = table[n][w];
        s.process(table, n, rules, addedRules);
        w++;
    }
}


function setup(table, rules, addedRules, start) {
    // Setup a table
    table.push([]);

    // I could be expecting anything.
    rules.forEach(function (r) {
        if (r.name === start) {
            addedRules.push(r);
            table[0].push(new State(r, 0, 0));
        }
    });

    advanceTo(0, table, rules, addedRules);
}





function Parser(rules, start) {
    this.table = [];
    var addedRules = [];
    this.rules = rules;
    this.start = start || rules[0];

    setup(this.table, rules, addedRules, this.start);
    this.current = 0;
}

Parser.prototype.feed = function(chunk) {
    for (var chunkPos = 0; chunkPos < chunk.length; chunkPos++) {
        // We add new states to table[current+1]
        this.table.push([]);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        for (var w = 0; w < this.table[this.current + chunkPos].length; w++) {
            var s = this.table[this.current + chunkPos][w];
            // Try to consume the token
            var x = s.consume(chunk[chunkPos]);
            if (x) {
                // And then add it
                this.table[this.current + chunkPos + 1].push(x);
            }
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the
        //     reference row expected that rule
        // (b) predict the next nonterminal it expects
        //     by adding that nonterminal's start state
        // To prevent duplication, we also keep track
        // of rules we have already added
        var addedRules = [];
        advanceTo(this.current + chunkPos + 1, this.table, this.rules, addedRules);

        // If needed, throw an error:
        if (this.table[this.table.length-1].length === 0) {
            // No states at all! This is not good.
            var err = new Error(
                "nearley: No possible parsings (@" + (this.current + chunkPos)
                    + ": '" + chunk[chunkPos] + "')."
            );
            err.offset = this.current + chunkPos;
            throw err;
        }
    }

    this.current += chunkPos;
    // Incrementally keep track of results
    this.results = this.finish();

    // Allow chaining, for whatever it's worth
    return this;
};

Parser.prototype.finish = function() {
    // Return the possible parsings
    var considerations = [];
    var myself = this;
    this.table[this.table.length-1].forEach(function (t) {
        if (t.rule.name === myself.start && t.expect === t.rule.symbols.length && t.reference === 0) {
            considerations.push(t);
        }
    });
    return considerations.map(function(c) {return c.data; });
};

module.exports = {
    Parser: Parser,
    rule: Rule
};
