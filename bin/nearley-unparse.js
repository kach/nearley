#!/usr/bin/env node

var fs = require('fs');
var nearley = require('../lib/nearley.js');
var nomnom = require('nomnom');
var randexp = require('randexp');

var opts = nomnom
    .script('nearley-unparse')
    .option('file', {
        position: 0,
        help: "A grammar .js file",
        required: true,
    })
    .option('start', {
        abbr: 's',
        help: "An optional start symbol (if not provided then use the parser start symbol)",
    })
    .option('count', {
        abbr: 'n',
        help: 'The number of samples to generate (separated by \\n).',
        default: 1
    })
    .option('out', {
        abbr: 'o',
        help: "File to output to (defaults to stdout)",
    })
    .option('version', {
        abbr: 'v',
        flag: true,
        help: "Print version and exit",
        callback: function() {
            return require('../package.json').version;
        }
    })
    .parse();

var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout;

var grammar = new require(require('path').resolve(opts.file));

function gen(grammar, name) {
    var stack = [name];
    var rules = grammar.ParserRules;

    while (stack.length > 0) {
        var currentname = stack.pop();
        if (typeof(currentname) === 'string') {
            var goodrules = grammar.ParserRules.filter(function(x) {
                return x.name === currentname;
            });
            if (goodrules.length > 0) {
                var chosen = goodrules[
                    Math.floor(Math.random()*goodrules.length)
                ];
                for (var i=chosen.symbols.length-1; i>=0; i--) {
                    stack.push(chosen.symbols[i]);
                }
            } else {
                throw new Error("Nothing matches rule: "+currentname+"!");
            }
        } else if (currentname.test) {
            var c = new randexp(currentname).gen();
            output.write(c);
            continue;
        } else if (currentname.literal) {
            var c = currentname.literal;
            output.write(c);
            continue;
        }
    }
}

for (var i=0; i<parseInt(opts.count); i++) {
    gen(grammar, opts.start ? opts.start : grammar.ParserStart);
    output.write("\n");
}
