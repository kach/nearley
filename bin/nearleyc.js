#!/usr/bin/env node

var fs = require('fs');
var nearley = require('../lib/nearley.js');
var opts = require('commander');
var Compile = require('../lib/compile.js');
var StreamWrapper = require('../lib/stream.js');

opts
    .description('Compile grammar files to JavaScript')
    .usage('[file] [options]')
    .option(
        '-o, --out <file>',
        'File to output to (defaults to stdout)'
    )
    .option(
        '-e, --export <name>',
        'Variable to set the parser to',
        'grammar'
    )
    .option(
        '-N, --nojs',
        "Don't compile postprocessors (for testing)",
        false
    )
    .version(require('../package.json').version)
    .parse(process.argv);

opts.file = opts.args[0]

var input = opts.file ? fs.createReadStream(opts.file) : process.stdin;
var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout;

var parserGrammar = nearley.Grammar.fromCompiled(require('../lib/nearley-language-bootstrapped.js'));
var parser = new nearley.Parser(parserGrammar);
var generate = require('../lib/generate.js');
var lint = require('../lib/lint.js');

input
    .pipe(new StreamWrapper(parser))
    .on('finish', function() {
        var c = Compile(parser.results[0], opts);
        lint(c, {'out': process.stderr});
        output.write(generate(c, opts.export));
    });
