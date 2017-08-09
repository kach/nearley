#!/usr/bin/env node

var fs = require('fs');
var nomnom = require('nomnom');
var nearleyc = require('../nearleyc');

var opts = nomnom
    .script('nearleyc')
    .option('file', {
        position: 0,
        help: "An input .ne file (if not provided then read from stdin)",
    })
    .option('out', {
        abbr: 'o',
        help: "File to output to (defaults to stdout)",
    })
    .option('export', {
        abbr: 'e',
        help: "Variable to set the parser to",
        default: "grammar"
    })
    .option('nojs', {
        flag: true,
        default: false,
        help: "Don't compile postprocessors (for testing)."
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

var input = opts.file ? fs.createReadStream(opts.file) : process.stdin;
var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout;

nearleyc.compileFile(input, output, {
    nojs: opts.nojs,
    'export': opts.export,
    lint: process.stderr,
})

