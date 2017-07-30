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
  - [Custom matchers](#custom-matchers)
- [Using a parser](#using-a-parser)
  - [Catching errors](#catching-errors)
  - [Custom lexers](#custom-lexers)
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

nearley is used by [artificial intelligence](https://github.com/ChalmersGU-AI-course/shrdlite-course-project)
and [computational linguistics](https://wiki.eecs.yorku.ca/course_archive/2014-15/W/6339/useful_handouts)
classes at universities, as well as [file format parsers](https://github.com/raymond-h/node-dmi),
[markup languages](https://github.com/bobbybee/uPresent) and
[complete programming languages](https://github.com/bobbybee/carbon).
It's an npm [staff pick](https://www.npmjs.com/package/npm-collection-staff-picks).

## Installation

nearley is published as an [NPM](https://docs.npmjs.com/getting-started/what-is-npm) package compatible with [Node.js](https://nodejs.org/en/) and browsers.

```bash
npm install nearley
```

Also install the package globally if you'd like to use it directly via CLI:

```bash
npm install -g nearley
```

Use a tool like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) to include nearley in your browser code.

You can uninstall the nearley compiler using `npm uninstall -g nearley`.

## Usage

- Describe your grammar in the nearley syntax. `grammar.ne`:

```js
main -> (statement "\n"):+
statement -> "foo" | "bar"
```

Check out the wonderful [nearley playground](https://omrelli.ug/nearley-playground/) to explore nearley interactively in your browser.

- Compile the grammar to JS:

```bash
nearleyc grammar.ne -o grammar.js
```

Add a script to `scripts` in `package.json` that runs the command above if you only have a locally installed copy of nearley.

- Create a parser and feed it data:

```js
import { Parser, Grammar } from "nearley";
import * as grammar from "./grammar";

var parser = new Parser(Grammar.fromCompiled(grammar));

parser.feed("foo\n");
console.log(p.results[0]); // [[[ "foo" ],"\n" ]]
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

A nonterminal can have multiple alternative rules, separated by vertical bars (`|`):

```js
expression ->
      number "+" number
    | number "-" number
    | number "*" number
    | number "/" number
```

A special kind of rule is an **epsilon rule**. It matches nothing and is written as `null`. The following nonterminal matches zero or more `cow`s in a row:

```js
a -> null
    | a "cow"
```

Keep in mind that nearley syntax is not sensitive to formatting. You may keep rules on the same line: `foo -> bar | qux`.

### Comments

Everything starting from `#` to the end of a line is ignored as a comment:

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

- `data: Array` - array with the parsed parts of the rule. It will always be an array, even if there's only one part. If a rule contains nonterminals with their own postprocessors, the respective parts will already be transformed.
- `location: number` - the index (zero-based) at which the rule match starts. It's useful to retain this information in the syntax tree if you're writing an interpreter.
- `reject: Object` - return this object to signal that this rule doesn't actually match. This allows you to restrict or conditionally support language features.

Remember that a postprocessor is scoped to a single rule, not the whole nonterminal. If a nonterminal has multiple alternative rules, each of them can have its own postprocessor:

```js
expression ->
      number "+" number {% ([first, _, second]) => first + second %}
    | number "-" number {% ([first, _, second]) => first - second %}
    | number "*" number {% ([first, _, second]) => first * second %}
    | number "/" number {% ([first, _, second]) => first / second %}
```

There're several built-in postprocessors for the most common scenarios:

- `id` - returns the first element of the `data` array. Useful for single-element arrays: `foo -> bar {% id %}`
- `arrpush` - joins an array and the last element. Useful for recursive definitions of sequences: `foo -> bar | foo bar {% arrpush %}`
- `nuller` - returns null. Useful for unimportant rules: `space -> " " {% nuller %}`

### Target languages

By default, `nearleyc` compiles grammar to JavaScript. You can also choose CoffeeScript or TypeScript by adding `@preprocessor coffee` or `@preprocessor typescript` at the top of your grammar file.

Remember to write postprocessors in the same language. They are preserved as-is.

If you would like to support a different language, feel free to file a PR!

### Charsets

You can use valid RegExp charsets in a rule:

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

You can create "polymorphic" rules through macros:

```ini
match3[X] -> $X $X $X
quote[X]  -> "'" $X "'"

main -> match3[quote["Hello?"]]
# matches "'Hello?''Hello?''Hello?'"
```

Macros are dynamically scoped:

```ini
foo[X, Y] -> bar[("moo" | "oink" | "baa")] $Y
bar[Z]    -> $X " " $Z # uses $X from its caller
main -> foo["Cows", "."]
# matches "Cows oink." and "Cows moo."
```

Macros are expanded at compile time and inserted in places they are used. They are not "real" rules.

Therefore, macros *cannot* be recursive (`nearleyc` will go into an infinite loop trying
to expand the macro-loop).

### Additional JS

For more intricate postprocessors, or any other functionality you may need, you
can include chunks of JavaScript code between production rules by surrounding
it with `@{% ... %}`:

```js
@{% import { cowSays } from "./cow.js"; %}
cow -> "moo" {% ([moo]) => cowSays(moo) %}
```

Note that it doesn't matter where you add these; they all get hoisted to the
top of the generated code.

### Importing

You can include the content of other grammar files:

```
@include "../misc/primitives.ne" # path relative to file being compiled
sum -> number "+" number
```

There are several builtin helper files that you can include:

```
@builtin "cow.ne"
main -> cow:+
```

See the [`builtin/`](builtin) directory for more details. Contributions are
welcome here!

Including a file imports *all* of the nonterminals defined in it, as
well as any JS, macros, and config options defined there.

## Tokenizers

Nearley assumes by default that your fundamental unit of parsing, called a
*token*, is a character. That is, you're parsing a list of characters. However,
sometimes you want to preprocess your string to turn it into a list of *lexical
tokens*. This means, instead of seeing "1", "2", "3", the nearley might just
see a single list item "123". This is called *tokenizing*, and it can bring you
large performance gains. It also allows you to write cleaner, more
maintainable grammars and helps to prevent ambiguous grammars.

Nearley is a really clever parser, but tokenizing -- joining characters into words -- is a really simple task. So using something much more dumb (a "lexer") for this task is a lot better, and can make things faster by more than an order-of-magnitude.

Nearley has built-in support for [Moo](https://github.com/tjvr/moo), a super-fast tokenizer. Have a look at [the Moo documentation](https://github.com/tjvr/moo#usage) to learn how to use it.

Enable the `@lexer` option to use it:

```js
@{%

const moo = require('moo')

let lexer = moo.compile({
  WS:      /[ \t]+/,
  comment: /\/\/.*?$/,
  number:  ['0', /[1-9][0-9]*/],
  string:  /"((?:\\["\\]|[^\n"\\])*)"/,
  lparen:  '(',
  rparen:  ')',
  keyword: ['while', 'if', 'then', 'else', 'moo', 'cows', 'times'],
  NL:      {match: '\n', lineBreaks: true},
})

%}

@lexer lexer
```

You can now write rules which match a token like so:

```
fraction -> %number _ times _ %number  {% d => ['*', d[0], d[4] %}
```

Or match against the value of a token:

```
E -> "if" E "then" E
```

You use the parser exactly as normal; you can `feed()` in chunks of strings, and Nearley will give you the parsed results in return.

Nearley will include line numbers etc. in error messages.

### Custom matchers

Sometimes you might want a more flexible way of matching tokens, whether you're using `@lexer` or not.

Custom matchers can be defined in two ways: literal tokens and testable tokens. A
literal token matches exactly, while a testable token runs a function to test
whether it is a match or not.

```
@{%
var print_tok  = {literal: "print"};
var number_tok = {test: function(x) {return x.constructor === Number; }}
%}

main -> %print_tok %number_tok
```

Now, instead of parsing the string `"print 12"`, you would parse the array
`["print", 12]`.

## Using a parser

nearley exposes the following API:

```js
var grammar = require("generated-code.js");
var nearley = require("nearley");

// Create a Parser object from our grammar.
var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

// Parse something
p.feed("1+1");
// p.results --> [ ["sum", "1", "1"] ]
```

The `Parser` object can be fed data in parts with `.feed(data)`. You can then
find an array of parsings with the `.results` property. If `results` is empty,
then there are no parsings. If `results` contains multiple values, then that
combination is ambiguous.

The incremental feeding design is inspired so that you can parse data from
stream-like inputs, or even dynamic readline inputs. For example, to create a
Python-style REPL where it continues to prompt you until you have entered a
complete block.

```js
p.feed(prompt_user(">>> "));
while (p.results.length < 1) {
    p.feed(prompt_user("... "));
}
console.log(p.results);
```

The `nearley.Parser` constructor takes an optional third parameter, `options`,
which is an object with the following possible keys:

- `keepHistory` (boolean, default `false`): if set to `true`, nearley will
  preserve the internal state of the parser in the parser's `.table` property.
  Preserving the state has some performance cost (because it can potentially be
  very large), so we recommend leaving this as `false` unless you are familiar
  with the Earley parsing algorithm and are planning to do something exciting
  with the parse table.

- `lexer`: a [custom Lexer](#custom-lexers).

### Catching errors

If there are no possible parsings, nearley will throw an error whose `offset`
property is the index of the offending token.

```js
try {
    p.feed("1+gorgonzola");
} catch(parseError) {
    console.log(
        "Error at character " + parseError.offset
    ); // "Error at character 2"
}
```

### Custom lexers

If you don't want to use [Moo](https://github.com/tjvr/moo), our recommended lexer/tokenizer, you can define your own. You can pass a `lexer` instance to Parser, which must have the following interface:

- `reset(chunk, Info)`: set the internal buffer to `chunk`, and restore line/col/state info taken from `save()`.
- `next() -> Token` return e.g. `{type, value, line, col, …}`. Only the `value` attribute is required.
- `save() -> Info` -> return an object describing the current line/col etc. This allows us to preserve this information between `feed()` calls, and also to support `Parser#rewind()`. The exact structure is lexer-specific; nearley doesn't care what's in it.
- `formatError(token)` -> return a string with an error message describing the line/col of the offending token. You might like to include a preview of the line in question.
- `has(tokenType)` -> return true if the lexer can emit tokens with that name. Used to resolve `%`-specifiers in compiled nearley grammars.

If Parser isn't given a lexer option, it will look for a `.lexer` attribute on its Grammar. The `@lexer` directive allows exporting a lexer object from your `.ne` grammar file. (See `json.ne` for an example.)

## Exploring a parser interactively

The global install will provide `nearley-test`, a simple command-line tool you
can use to inspect what a parser is doing. You input a generated `grammar.js`
file, and then give it some input to test the parser against. `nearley-test`
prints out the output if successful, and also gives you the complete parse
table used by the algorithm. This is very helpful when you're testing a new
parser.

This was previously called `bin/nearleythere.js` and written by Robin.

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
