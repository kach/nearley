
var path = require('path');

var nearley = require('../nearley');

var Compile = require('./compile');
var parserGrammar = nearley.Grammar.fromCompiled(require('./nearley-language-bootstrapped'));
var generate = require('./generate');
var lint = require('./lint');
var StreamWrapper = require('./stream')

function generateSource(results, options) {
    var options = options || {};

    // compile
    var c = Compile(results[0], options);

    // lint
    if (options.lint) {
        // options.lint is anything with a .write() method
        lint(c, {out: options.lint});
    }

    // generate
    var source = generate(c, 'grammar');
    return source;
}

function compile(source, options) {
    // parse
    var p = new nearley.Parser(parserGrammar);
    p.feed(source);

    // compile, lint, generate
    var source = generateSource(p.results, options);

    // eval
    return evalGrammar(source);
}

// TODO if streams have no perf benefit here, consider dropping this
function compileFile(inputStream, outputStream, options) {
    var parser = new nearley.Parser(parserGrammar)
    inputStream
        // parse
        .pipe(new StreamWrapper(parser))
        .on('finish', function() {
            // compile, lint, generate
            var source = generateSource(parser.results, options)
            // write
            outputStream.write(source)
        })
}

function requireFromString(source) {
    var filename = '.'
    var Module = module.constructor;
    var m = new Module();
    m.paths = Module._nodeModulePaths(path.dirname(filename))
    m._compile(source, filename);
    return m.exports;
}

function evalGrammar(compiledGrammar) {
    var exports = requireFromString(compiledGrammar);
    return new nearley.Grammar.fromCompiled(exports);
}

// TODO figure out what API we should be exposing here.
module.exports = {
    compile: compile, // (source, options) -> Grammar
    compileFile: compileFile, // (inputStream, outputStream, options)
    lint: require('../nearleyc/lint'),
};

