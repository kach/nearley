---
title: Using a parser
---

This section describes nearley's parser API.

Once you have compiled a `grammar.ne` file to a `grammar.js` module, you can
then use nearley to instantiate a `Parser` object.

First, import nearley and your grammar.

```js
const nearley = require("nearley");
const grammar = require("./grammar.js");
```

Note that if you are parsing in the browser, you can simply include
`nearley.js` and `grammar.js` in `<script>` tags.

Next, use the grammar to create a new `nearley.Parser` object.

```js
// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
```

Once you have a `Parser`, you can `.feed` it a string to parse. Since nearley
is a *streaming* parser, you can feed strings more than once. For example, a
REPL might feed the parser lines of code as the user enters them:

```js
// Parse something!
parser.feed("if (true) {");
parser.feed("x = 1");
parser.feed("}");
// or, parser.feed("if (true) {x=1}");
```

Finally, you can query the `.results` property of the parser.

```js
// parser.results is an array of possible parsings.
console.log(parser.results);
// [{'type': 'if', 'condition': ..., 'body': ...}]
```


### A note on ambiguity

Why is `parser.results` an array? Sometimes, a grammar can parse a particular
string in multiple different ways. For example, the following grammar parses
the string `"xyz"` in two different ways.

```ne
x -> "xy" "z"
   | "x" "yz"
```

Such grammars are *ambiguous*. nearley provides you with *all* the parsings. In
most cases, however, your grammars should not be ambiguous (parsing ambiguous
grammars is inefficient!). Thus, the most common usage is to simply query
`parser.results[0]`.

You might like to check first that `parser.results.length` is exactly 1; if
there is more than one result, then your grammar is ambiguous!


### Catching errors

nearley is a *streaming* parser: you can call `feed()` as many times as you
like. This means there are two ways parsing can go wrong.

Consider the simple parser below for the examples to follow.

```js
main -> "Cow goes moo." {% function(d) {return "yay!"; } %}
```

If nearley gets **partway through the chunk** you fed, and parsing cannot
continue, then nearley will throw an error whose `offset` property is the index
of the offending token. There is no way to recover from this by feeding more
data.

```js
try {
    parser.feed("Cow goes% moo.");
} catch (parseError) {
    console.log("Error at character " + parseError.offset); // "Error at character 9"
}
```

Errors are nicely formatted for you:

```
Error: Syntax error at line 1 col 9:

1 Cow goes% moo.
          ^

Unexpected "%"
```

**After `feed()` finishes**, the `results` array will contain all possible
parsings.

If there are no possible parsings given the current input, but in the *future*
there *might* be results if you feed it more strings, then nearley will
temporarily set the `results` array to the empty array, `[]`.

```js
parser.feed("Cow ");  // parser.results is []
parser.feed("goes "); // parser.results is []
parser.feed("moo.");  // parser.results is ["yay!"]
```

If you're done calling `feed()`, but the array is still empty, this indicates
"unexpected end of input". Make sure to check there's at least one result.

If there's more than one result, that indicates ambiguity--see above.


### Accessing the parse table

If you are familiar with the Earley parsing algorithm, you can access the
internal parse table using `Parser.table` (this, for example, is how
`nearley-test` works). One caveat, however: you must pass the `keepHistory`
option to nearley to prevent it from garbage-collecting inaccessible columns of
the table.

```js
const nearley = require("nearley");
const grammar = require("./grammar");

const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar),
    { keepHistory: true }
);


parser.feed(...);
console.log(parser.table);
```

### Using preprocessors

By default, `nearleyc` compiles your grammar to JavaScript. However, you can
instead choose to compile to CoffeeScript or TypeScript by adding
`@preprocessor coffee` or `@preprocessor typescript` at the top of your grammar
file. This can be useful to write your postprocessors in a different language,
and to get type annotations if you wish to use nearley in a statically typed
dialect of JavaScript.

#### Typescript Preprocessor Changes

If you have recently upgraded to a newer version of nearley, you might have run
into an issue with `error TS2345` talking about a variable
`missing the following properties from type 'CompiledRules': ParserStart, ParserRules`
This is a result of a change in the output format of the grammar, but is very easily fixed.
Just change the way you import the grammar from `import * as grammar from "./path/to/grammar"`
to `import grammar from "./path/to/grammar"` and everything should compile nicely again.

### What's next?

Now that you know how to use parsers, [learn how to add a tokenizer to speed
things up!](tokenizers)
