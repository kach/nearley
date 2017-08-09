![](www/logo/nearley-purple.png)

# [nearley](http://nearley.js.org) [![JS.ORG](https://img.shields.io/badge/js.org-nearley-ffb400.svg?style=flat-square)](http://js.org)

> Simple parsing in JavaScript

nearley is a fast and extremely powerful parser based on the [Earley algorithm](https://en.wikipedia.org/wiki/Earley_parser). It can parse literally anything you throw at it.

<!-- $ npm install -g doctoc -->
<!-- $ doctoc --notitle README.md -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [CLI](#cli)
- [Parser specification](#parser-specification)
  - [Terminals, nonterminals, rules](#terminals-nonterminals-rules)
  - [Comments](#comments)
  - [Postprocessors](#postprocessors)
  - [Target languages](#target-languages)
  - [Charsets](#charsets)
  - [Case-insensitive String Literals](#case-insensitive-string-literals)
  - [EBNF](#ebnf)
  - [Macros](#macros)
  - [Additional JS](#additional-js)
  - [Importing](#importing)
- [Tokenizers](#tokenizers)
- [Advanced topics](#advanced-topics)
- [Recipes](#recipes)
  - [Catching errors](#catching-errors)
- [Exploring a parser interactively](#exploring-a-parser-interactively)
- [The Unparser](#the-unparser)
- [Automagical Railroad Diagrams](#automagical-railroad-diagrams)
- [Other Tools](#other-tools)
- [Still confused?](#still-confused)
- [Contributing](#contributing)
- [Further reading](#further-reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

nearley compiles grammar definitions from a simple syntax resembling [BNF](https://en.wikipedia.org/wiki/Backus–Naur_form) to a JS representation.
You pass that representation to the nearley's tiny runtime, feed it data, and get the results.

nearley uses the Earley parsing algorithm with Joop Leo's optimizations to parse complex data structures easily.
Thanks to this algorithm, nearley can parse what other JavaScript parsers cannot.
It can handle *any* grammar you can define in BNF.
In fact, the nearley syntax is written in *itself* (this is called bootstrapping).

PEGjs and Jison are recursive-descent based, and so they will choke on a lot of
grammars, in particular [left recursive ones](http://en.wikipedia.org/wiki/Left_recursion).

nearley also has capabilities to catch errors gracefully, and detect ambiguous
grammars (grammars that can be parsed in multiple ways).

nearley is used by:

- [artificial intelligence](https://github.com/ChalmersGU-AI-course/shrdlite-course-project) and
- [computational linguistics](https://wiki.eecs.yorku.ca/course_archive/2014-15/W/6339/useful_handouts)
classes at universities;
- [file format parsers](https://github.com/raymond-h/node-dmi);
- [markup languages](https://github.com/idyll-lang/idyll-compiler); and
- [complete programming languages](https://github.com/sizigi/lp5562).

It's an npm [staff pick](https://www.npmjs.com/package/npm-collection-staff-picks).

## Installation

nearley is published as an [NPM](https://docs.npmjs.com/getting-started/what-is-npm) package compatible with [Node.js](https://nodejs.org/en/) and ES5-compatible browsers.

```bash
npm install nearley
```

Also install the package globally if you'd like to use it directly via CLI:

```bash
npm install -g nearley
```

> NOTE: You can follow along by using the wonderful [nearley playground](https://omrelli.ug/nearley-playground/), an online interface for exploring nearley grammars interactively in your browser.

## Usage

- Describe your grammar in the nearley syntax. `grammar.ne`:

```js
main -> (statement "\n"):+
statement -> "foo" | "bar"
```

- Compile the grammar to JS:

```bash
nearleyc grammar.ne -o grammar.js
```

Add a script to `scripts` in `package.json` that runs the command above if you only have a locally installed copy of nearley.

- Create a parser and feed it data:

```js
const nearley = require("nearley");
const grammar = require("./grammar");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something.
parser.feed("foo\n");

// parser.results is an array of possible parsings.
// It's empty if we're unable to parse the input.
// If the input can be interpreted in multiple ways, parser.results will contain all of them.
console.log(parser.results); // [[[[ "foo" ],"\n" ]]]
```

See below for detailed API and grammar syntax specification.

## CLI

Use `--help` with any of these commands to see available options.

- `nearleyc` compiles grammar files to JavaScript.
- `nearley-test` lets you quickly test a grammar against some input and see the
  results. It also lets you explore the internal state of nearley's Earley
  table, in case you find that interesting.
- `nearley-unparse` inverts a parser into a generator, allowing you to create
  random strings that match your grammar.
- `nearley-railroad` generates pretty railroad diagrams from your parser. This
  is mainly helpful for creating documentation, as (for example) on json.org.

## Parser specification

Let's explore the building blocks of a nearley parser.

### Terminals, nonterminals, rules

- A *terminal* is a string or a token. E.g. keyword `"if"` is a terminal.
- A *nonterminal* is a combination of terminals and other nonterminals. E.g. an if statement defined as `"if" condition statement` is a nonteminal.
- A *rule* (or production rule) is a definition of a nonterminal. E.g. `"if" condition statement` is the rule according to which the if statement nonterminal is parsed.

The first nonterminal of the grammar is the one the whole input must match. With the following grammar, nearley will try to parse text as `expression`.

```js
expression -> number "+" number
number -> [0-9]:+
```

Use the pipe character `|` to separate alternative rules for a nonterminal.

```js
expression ->
      number "+" number
    | number "-" number
    | number "*" number
    | number "/" number
```

The keyword `null` stands for the **epsilon rule**, which matches nothing. The following nonterminal matches zero or more `cow`s in a row, e.g. `cowcowcow`:

```js
a -> null
    | a "cow"
```

Keep in mind that nearley syntax is not sensitive to formatting. You're welcome to keep rules on the same line: `foo -> bar | qux`.

### Comments

Comments are marked with '#'. Everything from `#` to the end of a line is ignored:

```ini
expression -> number "+" number # sum of two numbers
```

### Postprocessors

By default, nearley wraps everything matched by a rule into an array. `rule -> "foo" "bar"` gives `["foo", "bar"]`.
Most of the time, you need to process that data in some way: filter out unnecessary tokens, transform into an object, etc.

Each rule can have a *postprocessor* - a JavaScript function that transforms the array and returns whatever you want to get instead. Postprocessors are wrapped in `{% %}`:

```js
expression -> number "+" number {%
    (data, location, reject) => ({
        type: "sum",
        args: [data[0], data[2]]
    })
%}
```

The rule above will parse `5+10` into `{ type: "sum", args: [5, 10] }`.

The postprocessor can be any function. It will be passed three arguments:

- `data: Array` - an array that contains the results of parsing each part of the rule.

    Note that it is still an array, even if the rule only has one part! You can use the built-in `{% id %}` postprocessor to convert a one-item array into the item itself.

- `location: number` - the index (zero-based) at which the rule match starts.

- `reject: Object` - return this object to signal that this rule doesn't actually match. This can be used for edge-conditions like "I want `[a-z]+` to match variables, EXCEPT for the keyword `if`…" -- but your grammar will no longer be context-free, so use it wisely!

    You can usually avoid the need for `reject` by using a [tokenizer](#tokenizers).

Remember that a postprocessor is scoped to a single rule, not the whole nonterminal. If a nonterminal has multiple alternative rules, each of them can have its own postprocessor:

```js
expression ->
      number "+" number {% ([first, _, second]) => first + second %}
    | number "-" number {% ([first, _, second]) => first - second %}
    | number "*" number {% ([first, _, second]) => first * second %}
    | number "/" number {% ([first, _, second]) => first / second %}
```

There are several built-in postprocessors for the most common scenarios:

- `id` - returns the first element of the `data` array. Useful for single-element arrays: `foo -> bar {% id %}`
- `nuller` - returns null. Useful for unimportant rules: `space -> " " {% nuller %}`

### Target languages

By default, `nearleyc` compiles your grammar to JavaScript. You can also choose CoffeeScript or TypeScript by adding `@preprocessor coffee` or `@preprocessor typescript` at the top of your grammar file.

Remember to write postprocessors in the same language. They are preserved as-is.

### Charsets

You can use valid RegExp charsets in a rule (unless you're using a [tokenizer](#tokenizers)):

    not_a_letter -> [^a-zA-Z]

The `.` character can be used to represent any character.

### Case-insensitive String Literals

You can create case-insensitive string literals by adding an `i` after the
string literal:

    cow -> "cow"i # matches CoW, COW, etc.

Note that if you are using a lexer, your lexer should use the `i` flag in its
regexes instead. That is, if you are using a lexer, you should *not* use the
`i` suffix in nearley.

### EBNF

nearley supports the `*`, `?`, and `+` operators from [EBNF](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form) (or RegExps) as shown:

```ini
batman -> "na":* "batman" # nananana...nanabatman
```

You can also use capture groups with parentheses. Its contents can be anything
that a rule can have:

```js
banana -> "ba" ("na" {% id %} | "NA" {% id %}):+
```

### Macros

Macros allow you to create polymorphic rules:

```ini
# Matches "'Hello?' 'Hello?' 'Hello?'"
main -> matchThree[inQuotes["Hello?"]]

matchThree[X] -> $X " " $X " " $X

inQuotes[X] -> "'" $X "'"
```

Macros are dynamically scoped, which means they see arguments passed to parent macros:

```ini
# Matches "Cows oink." and "Cows moo!"
main -> sentence["Cows", ("." | "!")]

sentence[ANIMAL, PUNCTUATION] -> animalGoes[("moo" | "oink" | "baa")] $PUNCTUATION

animalGoes[SOUND] -> $ANIMAL " " $SOUND # uses $ANIMAL from its caller
```

Macros are expanded at compile time and inserted in places they are used. They are not "real" rules.

Therefore, macros *cannot* be recursive (`nearleyc` will go into an infinite loop trying
to expand the macro-loop).

### Additional JS

For more intricate postprocessors, or any other functionality you may need, you
can include chunks of JavaScript code between production rules by surrounding
it with `@{% ... %}`:

```js
@{%
const cowSays = require("./cow.js");
%}

cow -> "moo" {% ([moo]) => cowSays(moo) %}
```

Note that it doesn't matter where you add these; they all get hoisted to the
top of the generated code.

### Importing

You can include the content of other grammar files:

```ini
@include "../misc/primitives.ne" # path relative to file being compiled
sum -> number "+" number # uses "number" from the included file
```

There are several builtin helper files that you can include:

```ini
@builtin "cow.ne"
main -> cow:+
```

See the [`builtin/`](builtin) directory for more details. Contributions are
welcome here!

Including a file imports *all* of the nonterminals defined in it, as
well as any JS, macros, and config options defined there.

## Tokenizers

By default, nearley splits the input into characters. This is called scannerless parsing.

A tokenizer splits the input into larger units called tokens, as a separate stage before parsing. For example, it lexes `512 + 10` into `["512", " ", "+", " ", "10"]`.

Using a tokenizer has many benefits--it:

- Often makes things faster by more than an order of magnitude.
- Allows you to write cleaner, more maintainable grammars. The idea is to explcitly list all possible token types.
- Helps to avoid ambiguity in the grammar. A lexer can confidently tell that `className` is not keyword `class` and `Name` after it.

nearley supports and recommends [Moo](https://github.com/tjvr/moo), a super-fast tokenizer. Here's a basic example:

```coffeescript
@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  number: /[0-9]+/,
  times:  /\*|x/
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

# Use %token to match any token of that type instead of "token":
multiplication -> %number %ws %times %ws %number {% ([first, , , , second]) => first * second %}
```

Have a look at [the Moo documentation](https://github.com/tjvr/moo#usage) to learn how to use it.

You can still use raw strings, but they will only match full tokens parsed by Moo. This is convenient for matching keywords.

```ini
ifStatement -> "if" condition "then" block
```

You use the parser exactly as normal: call `parser.feed(data)`, and nearley will give you the parsed results in return.

nearley will include line numbers etc. in error messages.

## Advanced topics

- [Best practices for writing grammars](docs/how-to-grammar-good.md)
- [Custom tokens and lexers, parsing arbitrary arrays instead of strings](docs/custom-tokens-and-lexers.md)
- [Accessing the parse table](docs/accessing-parse-table.md)
- [Using `nearleyc` in browsers](docs/using-in-frontend.md)

## Recipes

- [Generating and transforming a parse tree (CST and AST)](docs/generating-cst-ast.md)
- [Writing an indentation-aware (Python-like) lexer](https://gist.github.com/nathan/d8d1adea38a1ef3a6d6a06552da641aa)
- [Making a REPL for your grammar](docs/making-a-repl.md)

### Catching errors

If there are no possible parsings, nearley will throw an error whose `offset`
property is the index of the offending token.

```js
try {
    parser.feed("Cow goes% moo.");
} catch(parseError) {
    console.log("Error at character " + parseError.offset); // "Error at character 9"
}
```

## Exploring a parser interactively

The global install will provide `nearley-test`, a simple command-line tool you
can use to inspect what a parser is doing. You input a generated `grammar.js`
file, and then give it some input to test the parser against. `nearley-test`
prints out the output if successful, and also gives you the complete parse
table used by the algorithm. This is very helpful when you're testing a new
parser.

## The Unparser

The Unparser takes a (compiled) parser and outputs a random string that would
be accepted by the parser.

```bash
$ nearley-unparse -s number <(nearleyc builtin/prims.ne)
-6.22E94
```

You can use the Unparser to...

- ...test your parser specification by generating lots of random expressions and making sure all of them are "correct".
- ...generate random strings from a schema (for example, random email addresses or telephone numbers).
- ...create fuzzers and combinatorial stress-testers.
- ...play "Mad-Libs" automatically! (Practical application: automatic grammatically valid loremtext.)

The Unparser outputs as a stream by continuously writing characters to its
output pipe. So, if it "goes off the deep end" and generates a huge string, you
will still see output scrolling by in real-time.

To limit the size of the output, you can specify a bound on the depth with the
`-d` flag. This switches the Unparser to a different algorithm. A larger depth
bound corresponds to larger generated strings.

As far as I know, nearley is the only parser generator with this feature. It
is inspired by Roly Fentanes' [randexp](https://fent.github.io/randexp.js/),
which does the same thing with regular expressions.

## Automagical Railroad Diagrams

nearley lets you convert your grammars to pretty SVG railroad diagrams that you
can include in webpages, documentation, and even papers.

```bash
$ nearley-railroad regex.ne -o grammar.html
```

![Railroad demo](www/railroad-demo.png)

See a bigger example [here](http://nearley.js.org/www/railroad-demo.html).

(This feature is powered by
[`railroad-diagrams`](https://github.com/tabatkins/railroad-diagrams) by
tabatkins.)

## Other Tools

*This section lists nearley tooling created by other developers. These tools
are not distributed with nearley, so if you have problems, please contact the
respective author for support instead of opening an issue with nearley.*

Atom users can write nearley grammars with [this
plugin](https://github.com/bojidar-bg/nearley-grammar) by Bojidar Marinov.

Sublime Text users can write nearley grammars with [this
syntax](https://github.com/liam4/nearley-syntax-sublime) by liam4.

Vim users can use [this plugin](https://github.com/andres-arana/vim-nearley) by
Andrés Arana.

Visual Studio Code users can use [this
extension](https://github.com/karyfoundation/nearley-vscode) by Pouya Kary.

Python users can convert nearley grammars to Python using
[lark](https://github.com/erezsh/lark#how-to-use-nearley-grammars-in-lark) by
Erez.

Browser users can use
[nearley-playground](https://omrelli.ug/nearley-playground/) by Guillermo
Webster to explore nearley interactively in the browser. There is also a [Mac
app](https://github.com/pmkary/nearley-playground-mac) by Pouya Kary.

Webpack users can use
[nearley-loader](https://github.com/kozily/nearley-loader) by Andrés Arana to
load grammars directly.

Gulp users can use
[gulp-nearley](https://github.com/JosephJNK/gulp-nearley) by Joseph Junker to
compile grammars with a gulpfile.

## Still confused?

You can read [the calculator example](examples/calculator/arithmetic.ne) to get
a feel for the syntax (see it live
[here](http://hardmath123.github.io/nearley/examples/calculator/)). You can
read a grammar for [tosh](https://tosh.tjvr.org) over [here](examples/tosh.ne).
There are more sample grammars in the `/examples` directory. For larger
examples, we also have experimental parsers for **CSV** and **Lua**.

## Contributing

Clone, hack, PR. Tests live in `test/` and can be called with `npm test`. Make
sure you read `test/profile.log` after tests run, and that nothing has died
(parsing is tricky, and small changes can kill efficiency).

If you're looking for something to do, here's a short list of things that would
make me happy:

- Optimize. There are still plenty of optimizations that an enterprising
  JS-savant could implement.
- Help build the builtins library by PRing in your favorite primitives.
- Solutions to issues labeled "up for grabs" on the issue tracker.

Nearley is MIT licensed.

A big thanks to Nathan Dinsmore for teaching me how to Earley, Aria Stewart for
helping structure nearley into a mature module, and Robin Windels for
bootstrapping the grammar. Additionally, Jacob Edelman wrote an experimental
JavaScript parser with nearley and contributed ideas for EBNF support. Joshua
T. Corbin refactored the compiler to be much, much prettier. Bojidar Marinov
implemented postprocessors-in-other-languages. Shachar Itzhaky fixed a subtle
bug with nullables.

## Further reading

- Read my [blog post](http://hardmath123.github.io/earley.html) to learn more
  about the algorithm.
- Read about [Marpa](http://savage.net.au/Marpa.html) to
  learn more than you ever thought you wanted to know about parsing.
- A [nearley
  tutorial](https://medium.com/@gajus/parsing-absolutely-anything-in-javascript-using-earley-algorithm-886edcc31e5e)
  written by @gajus.

