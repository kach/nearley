const { createMacro } = require('babel-plugin-macros');
const { exec } = require('child_process');
const nearley = require('./lib/nearley.js');
const lint = require('./lib/lint.js');
const generate = require('./lib/generate.js');
const Compile = require('./lib/compile.js');
const { version } = require('./package.json');
const opts = require('commander');
const fs = require('fs');
const { dirname, resolve } = require('path');

let hurl = (why) => {throw why};


module.exports = createMacro(({references, babel, state: {file: {opts: {filename}}}}) => {
  references.default.map(({ parentPath: path}) => {
    path.isCallExpression() || hurl('used as non-call expression');

    const grammar = path.get("arguments.0");

    grammar.isStringLiteral() || hurl('first argument not string');

    const grammarFile = grammar.evaluate().value;

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(
      require('./lib/nearley-language-bootstrapped.js')
    ));


    opts._name="fake";
    // emulation of bin/nearleyc
    opts.version(version, '-v, --version')
      .arguments('<file.ne>')
      .option('-o, --out [filename.js]', 'File to output to (defaults to stdout)', false)
      .option('-e, --export [name]', 'Variable to set parser to', 'grammar')
      .option('-q, --quiet', 'Suppress linter')
      .option('--nojs', 'Do not compile postprocessors')
      // hack to allow us to parse custom params
      .parse(["fake", "fake", grammarFile])

    parser.feed('\n');
    parser.feed(fs.readFileSync(resolve(dirname(filename), grammarFile)));
    const c = Compile(
      parser.results[0],
      Object.assign({version}, opts)
    );

    path.replaceWithSourceString(`(()=>{${generate(c,  opts.export)}})()`);
  })
})
