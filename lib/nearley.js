(function () {
function Rule(name, symbols, postprocess) {
    this.name = name;
    this.symbols = symbols;        // a list of literal | regex class | nonterminal
    this.postprocess = postprocess;
    return this;
}

Rule.prototype.toString = function(withCursorAt) {
    function stringifySymbolSequence (e) {
        return (e.literal) ? JSON.stringify(e.literal)
                           : e.toString();
    }
    var symbolSequence = (typeof withCursorAt === "undefined")
                         ? this.symbols.map(stringifySymbolSequence).join(' ')
                         : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                             + " ● "
                             + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
    return this.name + " → " + symbolSequence;
}


// a State is a rule at a position from a given starting point in the input stream (reference)
function State(rule, expect, reference) {
    this.rule = rule;
    this.expect = expect;
    this.reference = reference;
    this.data = [];
}

State.prototype.toString = function() {
    return "{" + this.rule.toString(this.expect) + "}, from: " + (this.reference || 0);
};

State.prototype.nextState = function(data) {
    var state = new State(this.rule, this.expect + 1, this.reference);
    state.data = this.data.slice(0);  // make a cheap copy of currentState's data
    state.data.push(data);            // append the passed data
    return state;
};

State.prototype.consumeTerminal = function(inp) {
    var val = false;
    if (this.rule.symbols[this.expect]) {                  // is there a symbol to test?
       if (this.rule.symbols[this.expect].test) {          // is the symbol a regex?
          if (this.rule.symbols[this.expect].test(inp)) {  // does the regex match
             val = this.nextState(inp);  // nextState on a successful regex match
          }
       } else {   // not a regex, must be a literal
          if (this.rule.symbols[this.expect].literal === inp) {
             val = this.nextState(inp);  // nextState on a successful literal match
          }
       }
    }
    return val;
};

State.prototype.consumeNonTerminal = function(inp) {
    if (this.rule.symbols[this.expect] === inp) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.process = function(location, ind, table, rules, addedRules) {
    if (this.expect === this.rule.symbols.length) {
        // I have completed a rule
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
        if (!(this.data === Parser.fail)) {
            var w = 0;
            // We need a while here because the empty rule will
            // modify table[reference]. (when location === reference)
            var s,x;
            while (w < table[this.reference].length) {
                s = table[this.reference][w];
                x = s.consumeNonTerminal(this.rule.name);
                if (x) {
                    x.data[x.data.length-1] = this.data;
                    x.epsilonClosure(location, ind, table);
                }
                w++;
            }

            // --- The comment below is OUTDATED. It's left so that future
            // editors know not to try and do that.

            // Remove this rule from "addedRules" so that another one can be
            // added if some future added rule requires it.
            // Note: I can be optimized by someone clever and not-lazy. Somehow
            // queue rules so that everything that this completion "spawns" can
            // affect the rest of the rules yet-to-be-added-to-the-table.
            // Maybe.

            // I repeat, this is a *bad* idea.

            // var i = addedRules.indexOf(this.rule);
            // if (i !== -1) {
            //     addedRules.splice(i, 1);
            // }
        }
    } else {
        // I'm not done, but I can predict something
        var exp = this.rule.symbols[this.expect];

        // for each rule
        var me = this;
        rules.forEach(function(r) {
            // if I expect it, and it hasn't been added already
            if (r.name === exp && addedRules.indexOf(r) === -1) {
                // Make a note that you've added it already, and don't need to
                // add it again; otherwise left recursive rules are going to go
                // into an infinite loop by adding themselves over and over
                // again.

                // If it's the null rule, however, you don't do this because it
                // affects the current table row, so you might need it to be
                // called again later. Instead, I just insert a copy whose
                // state has been advanced one position (since that's all the
                // null rule means anyway)

                if (r.symbols.length > 0) {
                    addedRules.push(r);
                    new State(r, 0, location).epsilonClosure(location, ind, table);
                } else {
                    // Empty rule
                    // This is special
                    var copy = me.consumeNonTerminal(r.name);
                    if (r.postprocess) {
                        copy.data[copy.data.length-1] = r.postprocess([], this.reference);
                    } else {
                        copy.data[copy.data.length-1] = [];
                    }
                    copy.epsilonClosure(location, ind, table);
                }
            }
        });
    }
};

State.prototype.isComplete = function() {
    return this.expect === this.rule.symbols.length;
}

/**
 * Computes all possible epsilon-steps from the current state at
 * given location. States 0 through ind-1 in location are considered
 * for possible nullables.
 */
State.prototype.epsilonClosure = function(location, ind, table, result) {
    var col = table[location];
    if (!result) result = table[location]; // convenient common case

    result.push(this);

    if (!this.isComplete()) {
        for (var i = 0; i < ind; i++) {
            var state = col[i];
            if (state.isComplete() && state.reference === location) {
                var x = this.consumeNonTerminal(state.rule.name);
                if (x) {
                    x.data[x.data.length-1] = state.data;
                    x.epsilonClosure(location, ind, table);
                }
            }
        }
    }
}


function Parser(rules, start) {
    var table = this.table = [];
    this.rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
    this.start = start = start || this.rules[0].name;
    // Setup a table
    var addedRules = [];
    this.table.push([]);
    // I could be expecting anything.
    this.rules.forEach(function (r) {
        if (r.name === start) {  // add all rules named start
            addedRules.push(r);
            table[0].push(new State(r, 0, 0));
        }});  // this should refer to this object, not each rule inside the forEach
    this.advanceTo(0, addedRules);
    this.current = 0;
}

// create a reserved token for indicating a parse fail
Parser.fail = {};

Parser.prototype.advanceTo = function(n, addedRules) {
    // Advance a table, take the closure of .process for location n in the input stream
    var w = 0;
    while (w < this.table[n].length) {
        (this.table[n][w]).process(n, w, this.table, this.rules, addedRules);
        w++;
    }
}

Parser.prototype.feed = function(chunk) {
    for (var chunkPos = 0; chunkPos < chunk.length; chunkPos++) {
        // We add new states to table[current+1]
        this.table.push([]);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        for (var w = 0; w < this.table[this.current + chunkPos].length; w++) {
            var s = this.table[this.current + chunkPos][w];
            var x = s.consumeTerminal(chunk[chunkPos]);      // Try to consume the token
            if (x) {
                // And then add it
                this.table[this.current + chunkPos + 1].push(x);
            }
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added

        var addedRules = [];
        this.advanceTo(this.current + chunkPos + 1, addedRules);

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
        if (t.rule.name === myself.start
                && t.expect === t.rule.symbols.length
                && t.reference === 0
                && t.data !== Parser.fail) {
            considerations.push(t);
        }
    });
    return considerations.map(function(c) {return c.data; });
};

var nearley = {
    Parser: Parser,
    Rule: Rule
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = nearley;
} else {
   window.nearley = nearley;
}
})();
