// Node-only
var semver = require('semver');

var warn = function (opts, str) {
    opts.out.write("WARN"+"\t" + str + "\n");
}

function lintNames(grm, opts) {
    var all = [];
    grm.rules.forEach(function(rule) {
        all.push(rule.name);
    });
    grm.rules.forEach(function(rule) {
        rule.symbols.forEach(function(symbol) {
            if (!symbol.literal && !symbol.token && symbol.constructor !== RegExp) {
                if (all.indexOf(symbol) === -1) {
                    warn(opts,"Undefined symbol `" + symbol + "` used.");
                }
            }
        });
    });
}

function tokensEqual(a, b) {
    var typeA = typeof a;
    var typeB = typeof b;

    if (typeA !== typeB) {
        return false;
    } else if (typeA === "string") {
        return a === b;
    } else if (typeA === "object") {
        if (a.literal && b.literal) {
            return a.literal === b.literal;
        }

        var subA = a.ebnf && a.ebnf.subexpression;
        var subB = b.ebnf && b.ebnf.subexpression;

        if (!subA || !subB || subA.length !== subB.length) {
            return false;
        }

        return subA
            .map(function(tokA, ind) {
                return tokensEqual(tokA, subB[ind]);
            })
            .every(function(equal) { return equal; });
    }

    return false;
}

function checkCommonSubsequence(rhsA, rhsB) {
    var indB = 0;
    var notShared = [];

    // check if each token in rhsA is also in the same order in rhsB
    outer: for (var i = 0; i < rhsA.tokens.length; i++) {
        if (tokensEqual(rhsA.tokens[i], rhsB.tokens[indB])) {
            indB += 1;
            continue outer;
        }

        // add new block of tokens that are not shared
        notShared.push({
            ind: i + 0,
            tokens: [rhsB.tokens[indB]],
        });
        indB += 1;

        // look for a matching token in rhsB
        for (var j = indB; j < rhsB.tokens.length; j++) {
            if (tokensEqual(rhsA.tokens[i], rhsB.tokens[j])) {
                indB = j + 1;
                continue outer;
            }

            notShared[notShared.length - 1].tokens.push(rhsB.tokens[j]);
        }

        // no matching token in rhsB
        return null;
    }

    // every token in rhsA was found in order in rhsB
    if (indB < rhsB.tokens.length) {
        notShared.push({
            ind: rhsA.tokens.length,
            tokens: rhsB.tokens.slice(indB),
        });
    }

    return notShared;
}

function buildOptionalRHS(base, optionals) {
    var tokens = [];
    var optInd = 0;
    base.tokens.forEach(function(tok, ind) {
        var optional = optionals[optInd];
        if (optional !== undefined && optional.ind === ind) {
            optInd += 1;
            tokens.push({
                ebnf: { subexpression: optional.tokens.slice() },
                modifier: ":?",
            });
        }

        tokens.push(tok);
    });

    if (optInd < optionals.length) {
        tokens.push({
            ebnf: { subexpression: optionals[optionals.length - 1].tokens },
            modifier: ":?",
        });
    }

    return { tokens: tokens };
}

function printRule(lhs, rhs) {
    var str = "";
    rhs.tokens.forEach(function(token) {
        str += " ";
        if (typeof token === "string") {
            str += token;
        } else {
            str += token.ebnf.subexpression[0] + ":?";
        }
    });
    return lhs.name + " ->" + str + "\n";
}

function detectPotentialOptionals(structure, opts) {
    structure.forEach(function(lhs) {
        // keep a list of RHS indices so we only detect at most one problem
        // that includes a given RHS
        var alreadyFound = [];

        // check each possible pair of RHSs
        for (var i = 0; i < lhs.rules.length - 1; i++) {
            // don't bother checking RHSs that already have a problem
            if (alreadyFound.indexOf(i) !== -1) {
                continue;
            }

            for (var j = i + 1; j < lhs.rules.length; j++) {
                // don't bother checking RHSs that already have a problem
                if (alreadyFound.indexOf(j) !== -1) {
                    continue;
                }

                var rhsI = lhs.rules[i];
                var rhsJ = lhs.rules[j];
                var shorter;
                var subsequence;

                if (rhsI.tokens.length > rhsJ.tokens.length) {
                    shorter = rhsJ;
                    subsequence = checkCommonSubsequence(rhsJ, rhsI);
                } else {
                    shorter = rhsI;
                    subsequence = checkCommonSubsequence(rhsI, rhsJ);
                }

                if (subsequence === null) {
                    continue;
                }

                alreadyFound.push(i);
                alreadyFound.push(j);

                var simplified = buildOptionalRHS(shorter, subsequence);

                warn(opts, "The following rules:\n\t" +
                     printRule(lhs, rhsI) + "\t" + printRule(lhs, rhsJ) +
                     "\tcan be simplified into:\n\t" + printRule(lhs, simplified));

            }
        }
    });
}

function lint(grm, structure, opts) {
    if (!opts.out) opts.out = process.stderr;
    lintNames(grm, opts);
    detectPotentialOptionals(structure, opts);
}

module.exports = lint;
