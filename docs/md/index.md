## Installation

The nearley *compiler* converts grammar definitions from a simple
[BNF](https://en.wikipedia.org/wiki/Backus–Naur_form)-based syntax to a small
JS module. You can use that module to construct a nearley *parser*, which
parses input strings.

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

These are documented below.

> NOTE: If you're not ready to install nearley yet, you can follow along in
> your browser using the [nearley
> playground](https://omrelli.ug/nearley-playground/), an online interface for
> exploring nearley grammars interactively.

## Getting started: nearley in 3 steps

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

## Writing a parser: the nearley grammar language

This section describes the nearley grammar language, in which you can describe
grammars for nearley to parse. Grammars are conventionally kept in `.ne` files.
You can then use `nearleyc` to compile your `.ne` grammars to JavaScript
modules.

You can find many examples of nearley grammars online, as well as some in the
`examples/` directory of the [Github
repository](http://github.com/Hardmath123/nearley).

### Vocabulary

- A *terminal* is a single, constant string or a token. For example, the
  keyword `"if"` is a terminal.
- A *nonterminal* describes a set of possible strings. For example, all "if"
  statements can be described by a single nonterminal whose value depends on
  the condition and body of the if statement.
- A *rule* (or production rule) is a definition of a nonterminal. For example,
  ```js
  ifStatement -> "if" condition "then" statement "endif"
  ```
  is the rule according to which the if statement nonterminal, `ifStatement`,
  is parsed. It depends on the nonterminals `condition` and `statement`. A
  nonterminal can be described by multiple rules. For example, we can add a
  second rule
  ```js
  ifStatement -> "if" condition "then" statement "else" statement "endif"
  ```
  to support "else" clauses.

By default, nearley attempts to parse the first nonterminal defined in the
grammar. In the following grammar, nearley will try to parse input text as an
`expression`.

```js
expression -> number "+" number
expression -> number "-" number
expression -> number "*" number
expression -> number "/" number
number -> [0-9]:+
```

You can use the pipe character `|` to separate alternative rules for a
nonterminal. In the example below, `expression` has four different rules.

```js
expression ->
      number "+" number
    | number "-" number
    | number "*" number
    | number "/" number
```

The keyword `null` stands for the **epsilon rule**, which matches nothing. The
following nonterminal matches zero or more `cow`s in a row, such as
`cowcowcow`:

```js
a -> null | a "cow"
```

### Postprocessors

By default, nearley wraps everything matched by a rule into an array. For
example, when `rule -> "foo" "bar"` matches, it creates the "parse tree"
`["foo", "bar"]`.  Most of the time, however, you need to process that data in
some way: for example, you may want to filter out whitespace, or transform the
results into a custom JavaScript object.

For this purpose, each rule can have a *postprocessor*: a JavaScript function
that transforms the array and returns a "processed" version of the result.
Postprocessors are wrapped in `{% %}`:

```js
expression -> number "+" number {%
    function(data, location, reject) {
        return {
            operator: "sum",
            leftOperand: data[0],
            rightOperand: data[2] // data[1] is "+"
        };
    }
%}
```

The rule above will parse the string `5+10` into `{ operator: "sum",
leftOperand: "5", rightOperand: "10" }`.

The postprocessor can be any function. It will be passed three arguments:

- `data: Array` - an array that contains the results of parsing each part of
  the rule. Note that it is still an array, even if the rule only has one part!
  You can use the built-in `{% id %}` postprocessor to convert a one-item array
  into the item itself.
- `location: number` - the index (zero-based) at which the rule match starts.
  This is useful, for example, to construct an error message that tells you where
  in the source the error occurred.
- `reject: Object` - return this object to signal that this rule doesn't
  *actually* match. This is necessary in certain edge-conditions. For example,
  suppose you want sequences of letters to match variables, except for the
  keyword `var`. In this case, your rule may be
  ```js
  word -> [a-z]:+ {%
      function(d,l, reject) {
          if (d[0] == 'var') {
              return reject;
          } else {
              return {'var': d[0]};
          }
      }
  %}
  ```
  Please note that grammars using `reject` are not context-free, and are often
  much slower to parse. Use it wisely! You can usually avoid the need for
  `reject` by using a [tokenizer](#tokenizers).

Remember that a postprocessor is scoped to a single rule, not the whole
nonterminal. If a nonterminal has multiple alternative rules, each of them can
have its own postprocessor.

For arrow-function users, a convenient pattern is to decompose the `data` array
within the argument of the arrow function:

```js
expression ->
      number "+" number {% ([first, _, second]) => first + second %}
    | number "-" number {% ([first, _, second]) => first - second %}
    | number "*" number {% ([first, _, second]) => first * second %}
    | number "/" number {% ([first, _, second]) => first / second %}
```

There are two built-in postprocessors for the most common scenarios:

- `id` - returns the first element of the `data` array. This is useful to
  extract the content of a single-element array: `foo -> bar {% id %}`
- `nuller` - returns null. This is useful for whitespace rules: `space -> " "
  {% nuller %}`

#### Target languages

By default, `nearleyc` compiles your grammar to JavaScript. You can also choose
CoffeeScript or TypeScript by adding `@preprocessor coffee` or `@preprocessor
typescript` at the top of your grammar file. This can be useful to write your
postprocessors in a different language, and to get type annotations if you wish
to use nearley in a statically typed dialect of JavaScript.

### More syntax: tips and tricks

#### Comments

Comments are marked with '#'. Everything from `#` to the end of a line is
ignored:

```ini
expression -> number "+" number # sum of two numbers
```

#### Charsets

You can use valid RegExp charsets in a rule (unless you're using a
[tokenizer](#tokenizers)):

    not_a_letter -> [^a-zA-Z]

The `.` character can be used to represent any character.

#### Case-insensitive string literals

You can create case-insensitive string literals by adding an `i` after the
string literal:

    cow -> "cow"i # matches CoW, COW, and so on.

Note that if you are using a lexer, your lexer should use the `i` flag in its
regexes instead. That is, if you are using a lexer, you should *not* use the
`i` suffix in nearley.

#### EBNF

nearley supports the `*`, `?`, and `+` operators from
[EBNF](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form) as shown:

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

Macros are dynamically scoped, which means they see arguments passed to parent
macros:

```ini
# Matches "Cows oink." and "Cows moo!"
main -> sentence["Cows", ("." | "!")]

sentence[ANIMAL, PUNCTUATION] -> animalGoes[("moo" | "oink" | "baa")] $PUNCTUATION

animalGoes[SOUND] -> $ANIMAL " " $SOUND # uses $ANIMAL from its caller
```

Macros are expanded at compile time and inserted in places they are used. They
are not "real" rules. Therefore, macros *cannot* be recursive (`nearleyc` will
go into an infinite loop trying to expand the macro-loop).

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

### Importing other grammars

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
welcome!

Including a file imports *all* of the nonterminals defined in it, as well as
any JS, macros, and configuration options defined there.

## Using a parser: the nearley API

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


### Tokenizers

By default, nearley splits the input into a stream of characters. This is
called *scannerless* parsing.

A tokenizer splits the input into a stream of larger units called *tokens*.
This happens in a separate stage before parsing. For example, a tokenizer might
convert `512 + 10` into `["512", "+", "10"]`: notice how it removed the
whitespace, and combined multi-digit numbers into a single number.

Using a tokenizer has many benefits. It...

- ...often makes your parser faster by more than an order of magnitude.
- ...allows you to write cleaner, more maintainable grammars.
- ...helps avoid ambiguous grammars in some cases. For example, a tokenizer can
  easily tell you that `superclass` is a single keyword, not a sequence of
  `super` and `class` keywords.
- ...gives you *lexical information* such as line numbers for each token. This
  lets you make better error messages.

nearley supports and recommends [Moo](https://github.com/tjvr/moo), a
super-fast tokenizer. Here is a simple example:

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

Have a look at [the Moo documentation](https://github.com/tjvr/moo#usage) to
learn more about the tokenizer.

Note that when using a tokenizer, raw strings match full tokens parsed by Moo.
This is convenient for matching keywords.

```ini
ifStatement -> "if" condition "then" block
```

You use the parser as usual: call `parser.feed(data)`, and nearley will give
you the parsed results in return.


## Tools

As mentioned above, nearley ships with a host of tools.

### nearley-test: Exploring a parser interactively

A global install of nearley provides `nearley-test`, a simple command-line tool
you can use to inspect what a parser is doing. You input a generated
`grammar.js` file, and then give it some input to test the parser against.
`nearley-test` prints out the output if successful, and optionally
pretty-prints the internal parse table used by the algorithm. This is helpful
to test a new parser.

### nearley-unparse: The Unparser

The Unparser takes a (compiled) parser and outputs a random string that would
be accepted by the parser.

```bash
$ nearley-unparse -s number <(nearleyc builtin/prims.ne)
-6.22E94
```

You can use the Unparser to...

- ...test your parser specification by generating lots of random expressions
  and making sure all of them are "correct".
- ...generate random strings from a schema (for example, random email addresses
  or telephone numbers).
- ...create fuzzers and combinatorial stress-testers.
- ...play "Mad-Libs" automatically! (Practical application: automatic
  grammatically valid loremtext.)

The Unparser outputs as a stream by continuously writing characters to its
output pipe. So, if it "goes off the deep end" and generates a huge string, you
will still see output scrolling by in real-time.

To limit the size of the output, you can specify a bound on the depth with the
`-d` flag. This switches the Unparser to a different algorithm. A larger depth
bound corresponds to larger generated strings.

As far as I know, nearley is the only parser generator with this feature. It
is inspired by Roly Fentanes' [randexp](https://fent.github.io/randexp.js/),
which does the same thing with regular expressions.

### nearley-railroad: Automagical Railroad Diagrams

nearley lets you convert your grammars to pretty SVG railroad diagrams that you
can include in webpages, documentation, and even papers.

```bash
$ nearley-railroad regex.ne -o grammar.html
```

![Railroad demo](/www/railroad-demo.png)

See a bigger example [here](http://nearley.js.org/www/railroad-demo.html).

(This feature is powered by
[`railroad-diagrams`](https://github.com/tabatkins/railroad-diagrams) by
tabatkins.)

### Other Tools

*This section lists nearley tooling created by other developers. These tools
are not distributed with nearley, so if you have problems, please contact the
respective author for support instead of opening an issue with nearley.*

**Atom** users can write nearley grammars with [this
plugin](https://github.com/bojidar-bg/nearley-grammar) by Bojidar Marinov.

**Sublime Text** users can write nearley grammars with [this
syntax](https://github.com/liam4/nearley-syntax-sublime) by liam4.

**Vim** users can use [this plugin](https://github.com/tjvr/vim-nearley) by Tim
(based on [this older plugin](https://github.com/andres-arana/vim-nearley) by
Andrés Arana).

**Visual Studio Code** users can use [this
extension](https://github.com/karyfoundation/nearley-vscode) by Pouya Kary.

**Python** users can convert nearley grammars to Python using
[lark](https://github.com/erezsh/lark#how-to-use-nearley-grammars-in-lark) by
Erez.

**Node** users can programmatically access the unparser using
[nearley-there](https://github.com/stolksdorf/nearley-there) by Scott
Tolksdorf.

**Browser** users can use
[nearley-playground](https://omrelli.ug/nearley-playground/) by Guillermo
Webster to explore nearley interactively in the browser. There is also a [Mac
app](https://github.com/pmkary/nearley-playground-mac) by Pouya Kary.

**Webpack** users can use
[nearley-loader](https://github.com/kozily/nearley-loader) by Andrés Arana to
load grammars directly.

**Gulp** users can use
[gulp-nearley](https://github.com/JosephJNK/gulp-nearley) by Joseph Junker to
compile grammars with a gulpfile.

## Further reading

### Documentation

- [Best practices for writing grammars](how-to-grammar-good.html)
- [More on tokenizers](custom-tokens-and-lexers.html)
- [Accessing the internal parse table](accessing-parse-table.html)
- [Using `nearleyc` in browsers](using-in-frontend.html)

### Recipes

- [Writing an indentation-aware (Python-like) lexer](https://gist.github.com/nathan/d8d1adea38a1ef3a6d6a06552da641aa)

### Blog posts

- Read my [blog post](http://hardmath123.github.io/earley.html) to learn more
  about the algorithm.
- Read about [Marpa](http://savage.net.au/Marpa.html) to
  learn more than you ever thought you wanted to know about parsing.
- A [nearley
  tutorial](https://medium.com/@gajus/parsing-absolutely-anything-in-javascript-using-earley-algorithm-886edcc31e5e)
  written by @gajus.
