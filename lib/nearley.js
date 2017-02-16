(function () {
function Rule(name, symbols, postprocess) {
    this.id = ++Rule.highestId;
    this.name = name;
    this.symbols = symbols;        // a list of literal | regex class | nonterminal
    this.postprocess = postprocess;
    return this;
}
Rule.highestId = 0;

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
function State(rule, dot, reference, wantedBy) {
    this.rule = rule;
    this.dot = dot;
    this.reference = reference;
    this.data = [];
    this.wantedBy = wantedBy;
    this.isComplete = this.dot === rule.symbols.length;
}

State.prototype.toString = function() {
    return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
};

State.prototype.nextState = function(data) {
    var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
    state.data = this.data.slice(0);  // make a cheap copy of currentState's data
    state.data.push(data);            // append the passed data
    return state;
};

State.prototype.consumeTerminal = function(inp) {
    var val = false;
    if (this.rule.symbols[this.dot]) {                  // is there a symbol to test?
       if (this.rule.symbols[this.dot].test) {          // is the symbol a regex?
          if (this.rule.symbols[this.dot].test(inp)) {  // does the regex match
             val = this.nextState(inp);  // nextState on a successful regex match
          }
       } else {   // not a regex, must be a literal
          if (this.rule.symbols[this.dot].literal === inp) {
             val = this.nextState(inp);  // nextState on a successful literal match
          }
       }
    }
    return val;
};

State.prototype.consumeNonTerminal = function(inp) {
    if (this.rule.symbols[this.dot] === inp) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.finish = function() {
    if (this.rule.postprocess) {
        this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
    }
};


function Column(grammar, index) {
    this.grammar = grammar;
    this.index = index;
    this.states = [];
    this.wants = {}; // states that want some token
}

Column.prototype.process = function(nextColumn) {
    var states = this.states;
    var wants = this.wants;

    for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
        var state = states[w];

        if (state.isComplete) {
            state.finish();
            if (state.data !== Parser.fail) {
                this.complete(state);
            }

        } else {
            var exp = state.rule.symbols[state.dot];
            if (typeof exp !== 'string') { continue; }

            // TODO this doesn't catch indirect nullables
            this.predictNullables(exp, state);

            if (wants.hasOwnProperty(exp)) {
                wants[exp].push(state);
            } else {
                wants[exp] = [state];
                this.predict(exp);
            }
        }
    }
}

Column.prototype.predict = function(exp) {
    var rules = this.grammar.byName[exp] || [];

    for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        this.states.push(new State(r, 0, this.index, this.wants[exp]));
    }
}

Column.prototype.predictNullables = function(exp, state) {
    // insert a copy whose
    // state has been advanced one position (since that's all the
    // null rule means anyway)
    var nullables = this.grammar.nullablesByName[exp] || [];

    for (var i = 0; i < nullables.length; i++) {
        var r = nullables[i];
        var copy = state.consumeNonTerminal(r.name);
        var value = r.postprocess ? r.postprocess([], state.reference) : [];
        copy.data[copy.data.length - 1] = value;
        this.states.push(copy);
    }
}

Column.prototype.complete = function(right) {
    var wantedBy = right.wantedBy;
    for (var i = 0; i < wantedBy.length; i++) {
        var left = wantedBy[i];
        var copy = left.consumeNonTerminal(right.rule.name);
        if (copy) {
            copy.data[copy.data.length - 1] = right.data;
            this.states.push(copy);
        }
    }
}


function Grammar(rules, start) {
    this.rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
    this.start = start || this.rules[0].name;
    var byName = this.byName = {};
    var nullablesByName = this.nullablesByName = {};
    this.rules.forEach(function(rule) {
        var d = rule.symbols.length === 0 ? nullablesByName : byName;
        if (!d.hasOwnProperty(rule.name)) {
            d[rule.name] = [];
        }
        d[rule.name].push(rule);
    });
}


function Parser(rules, start) {
    //var grammar = this.grammar = rules instanceof Grammar ? rules : new Grammar(rules, start);
    var grammar = this.grammar = new Grammar(rules, start);

    // Setup a table
    var column = new Column(grammar, 0);
    var table = this.table = [column];

    // I could be expecting anything.
    column.wants[grammar.start] = [];
    column.predict(grammar.start);
    // TODO what if start rule is nullable?
    column.process();
    this.current = 0;
}

// create a reserved token for indicating a parse fail
Parser.fail = {};

Parser.prototype.feed = function(chunk) {
    for (var chunkPos = 0; chunkPos < chunk.length; chunkPos++) {
        // We add new states to table[current+1]
        var column = this.table[this.current + chunkPos];

        var n = this.current + chunkPos + 1;
        var nextColumn = new Column(this.grammar, n);
        this.table.push(nextColumn);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        for (var w = 0; w < column.states.length; w++) {
            var s = column.states[w];
            var x = s.consumeTerminal(chunk[chunkPos]);      // Try to consume the token
            if (x) {
                // And then add it
                nextColumn.states.push(x);
            }
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added

        nextColumn.process();

        // If needed, throw an error:
        if (nextColumn.states.length === 0) {
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
    var start = this.grammar.start;
    var column = this.table[this.table.length - 1]
    column.states.forEach(function (t) {
        if (t.rule.name === start
                && t.dot === t.rule.symbols.length
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
