// Node-only
var semver = require('semver');

var warn = (opts, str) => {
    opts.out.write("WARN"+"\t" + str + "\n");
}

function lintNames(grm, opts) {
    var all = [];
    grm.rules.forEach(rule => {
        all.push(rule.name);
    });
    grm.rules.forEach(rule => {
        rule.symbols.forEach(symbol => {
            if (!symbol.literal && !symbol.token && symbol.constructor !== RegExp) {
                if (!all.includes(symbol)) {
                    warn(opts,"Undefined symbol `" + symbol + "` used.");
                }
            }
        });
    });
}

function lint(grm, opts) {
    if (!opts.out) opts.out = process.stderr;
    lintNames(grm, opts);
}

module.exports = lint;
