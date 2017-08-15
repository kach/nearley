# Using the nearley compiler in browsers

Both the nearley parser and compiled grammars work in browsers; simply include `nearley.js` and your compiled `grammar.js` file in `<script>` tags and use nearley as usual. However, the nearley *compiler* is not designed for the browser -- you should precompile your grammars and only serve the generated JS files to browsers.

If you absolutely have to compile a grammar in a browser (for example, to implement a nearley IDE) then you can use a tool like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) to include the `nearley` NPM package in your browser code. Then, you can utilize the `nearleyc` internals to compile grammars dynamically.

```js
const nearley = require("nearley");
const compile = require("nearley/lib/compile");
const generate = require("nearley/lib/generate");
const nearleyGrammar = require("nearley/lib/nearley-language-bootstrapped");

const grammar = compileGrammar("main -> foo | bar");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

function compileGrammar(sourceCode) {
    // Parse the grammar source into an AST
    const grammarParser = new nearley.Parser(
        nearleyGrammar.ParserRules,
        nearleyGrammar.ParserStart
    );
    grammarParser.feed(sourceCode);
    const grammarAst = grammarParser.results[0]; // TODO check for errors

    // Compile the AST into a set of rules
    const grammarInfoObject = compile(grammarAst, {});
    // Generate JavaScript code from the rules
    const grammarJs = generate(grammarInfoObject, "grammar");

    // Pretend this is a CommonJS environment to catch exports from the grammar.
    const module = { exports: {} };
    eval(grammarJs);

    return module.exports;
}
```
