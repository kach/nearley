# Using nearley in browsers

Use a tool like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) to include the `nearley` NPM package in your browser code.

The runtime part works fine in browsers, but there's no concise way to compile a grammar and pass it to the `Parser` constructor. If you have a single static grammar, just precompile it with `nearleyc` and include the compiled JS file in your frontend code.

If you absolutely have to compile a grammar in a browser, e.g. the user enters it into a textarea, then here's an example for you:

```js
import { Parser, Grammar } from "nearley";
import * as compile from "nearley/lib/compile";
import * as generate from "nearley/lib/generate";
import * as nearleyGrammar from "nearley/lib/nearley-language-bootstrapped";

const grammar = compileGrammar("main -> foo | bar");

const parser = new Parser(Grammar.fromCompiled(grammar));

function compileGrammar(sourceCode) {
    // Oh boy, here we go. We're gonna do what `nearleyc` does.

    // Parse the custom grammar into AST as a nearley grammar.
    const grammarParser = new Parser(nearleyGrammar.ParserRules, nearleyGrammar.ParserStart);
    grammarParser.feed(sourceCode);
    const grammarAst = grammarParser.results[0];

    // Compile the custom grammar into JS.
    const grammarInfoObject = compile(grammarAst, {}); // Returns an object with rules, etc.
    const grammarJs = generate(grammarInfoObject, "grammar"); // Stringifies that object into JS.

    // `nearleyc` would save JS to a file and you'd require it, but in a browser we can only eval.
    const module = { exports: {} }; // Pretend this is a CommonJS environment to catch exports from the grammar.
    eval(grammarJs); // Evaluated code sees everything in the lexical scope, it can see `module`.

    return module.exports;
}
```
