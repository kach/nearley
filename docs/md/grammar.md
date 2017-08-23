---
title: Writing a parser
---

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
  `reject` by using a [tokenizer](tokenizers).

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
[tokenizer](tokenizers)):

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

There are some common nonterminals like "integer" and "double-quoted string"
that ship with nearley to help you prototype grammars efficiently. You can
include them using the `@builtin` directive:

```ini
@builtin "number.ne"
main -> int:+
```

(Note that we mean "efficient" in the sense that you can get them set up very
quickly. The builtins are _inefficient_ in the sense that they make your parser
slower. For a "real" project, you would want to switch to a lexer and implement
these primitives yourself!)

See the `builtin/` directory on Github for more details. Contributions are
welcome!

Note that including a file imports *all* of the nonterminals defined in it, as
well as any JS, macros, and configuration options defined there.
