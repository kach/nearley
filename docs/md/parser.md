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

```js
x -> "xy" "z"
   | "x" "yz"
```

Such grammars are *ambiguous*. nearley provides you with *all* the parsings. In
most cases, however, your grammars should not be ambiguous (parsing ambiguous
grammars is inefficient!). Thus, the most common usage is to simply query
`parser.results[0]`.


### Catching errors

nearley is a *streaming* parser: you can keep feeding it more strings. This
means that there are two error scenarios in nearley.

Consider the simple parser below for the examples to follow.

```js
main -> "Cow goes moo." {% function(d) {return "yay!"; } %}
```

If there are no possible parsings given the current input, but in the *future*
there *might* be results if you feed it more strings, then nearley will
temporarily set the `results` array to the empty array, `[]`.

```js
parser.feed("Cow ");  // parser.results is []
parser.feed("goes "); // parser.results is []
parser.feed("moo.");  // parser.results is ["yay!"]
```

If there are no possible parsings, and there is no way to "recover" by feeding
more data, then nearley will throw an error whose `offset` property is the
index of the offending token.

```js
try {
    parser.feed("Cow goes% moo.");
} catch(parseError) {
    console.log("Error at character " + parseError.offset); // "Error at character 9"
}
```


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

### What's next?

Now that you know how to use parsers, [learn how to add a tokenizer to speed
things up!](tokenizers)
