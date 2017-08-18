---
title: Getting started
---

nearley consists of two components: a *compiler* and a *parser*.

The nearley *compiler* converts grammar definitions from a simple
[BNF](https://en.wikipedia.org/wiki/Backus–Naur_form)-based syntax to a small
JS module. You can then use that module to construct a nearley *parser*, which
parses input strings.

### Installation

Both components are published as a single
[NPM](https://docs.npmjs.com/getting-started/what-is-npm) package compatible
with [Node.js](https://nodejs.org/en/) and most browsers.

To use the nearley *parser*, you need to install nearley **locally**.

```bash
$ npm install --save nearley
```

To use the nearley *compiler*, you need to *additionally* install nearley
**globally**.

```bash
$ npm install -g nearley
```
This actually adds several new commands to your `$PATH`:

- `nearleyc` compiles grammar files to JavaScript.
- `nearley-test` lets you quickly test a grammar against some input and see the
  results. It also lets you explore the internal state of nearley's Earley
  table, in case you find that interesting.
- `nearley-unparse` inverts a parser into a generator, allowing you to create
  random strings that match your grammar.
- `nearley-railroad` generates pretty railroad diagrams from your parser. This
  is mainly helpful for creating documentation, as (for example) on json.org.

These are documented on the [tooling page](tooling.html).

> Note: If you're not ready to install nearley yet, you can follow along in
> your browser using the [nearley
> playground](https://omrelli.ug/nearley-playground/), an online interface for
> exploring nearley grammars interactively.


### nearley in 3 steps

nearley was written with users in mind: getting started with nearley is as
simple as:

**Step 1: Describe your grammar** using the nearley syntax. In a file called
`grammar.ne`, write:

```js
main -> (statement "\n"):+
statement -> "foo" | "bar"
```

**Step 2: Compile** the grammar to a JavaScript module. On the command line,
run:

```bash
$ nearleyc grammar.ne -o grammar.js
```

**Step 3: Parse** some data! In a new JavaScript file, write:

```js
const nearley = require("nearley");
const grammar = require("./grammar.js");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed("foo\n");

// parser.results is an array of possible parsings.
console.log(parser.results); // [[[[ "foo" ],"\n" ]]]
```


### Further reading

- Take a look at a [nearley
  tutorial](https://medium.com/@gajus/parsing-absolutely-anything-in-javascript-using-earley-algorithm-886edcc31e5e)
  written by @gajus.
- Read my [blog post](http://hardmath123.github.io/earley.html) to learn more
  about the algorithm.
- Read about [Marpa](http://savage.net.au/Marpa.html) to
  learn more than you ever thought you wanted to know about parsing.
