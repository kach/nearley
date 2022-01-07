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
  ```ne
  ifStatement -> "if" condition "then" statement "endif"
  ```
  is the rule according to which the if statement nonterminal, `ifStatement`,
  is parsed. It depends on the nonterminals `condition` and `statement`. A
  nonterminal can be described by multiple rules. For example, we can add a
  second rule
  ```ne
  ifStatement -> "if" condition "then" statement "else" statement "endif"
  ```
  to support "else" clauses.

By default, nearley attempts to parse the first nonterminal defined in the
grammar. In the following grammar, nearley will try to parse input text as an
`expression`.

```ne
expression -> number "+" number
expression -> number "-" number
expression -> number "*" number
expression -> number "/" number
number -> [0-9]:+
```

You can use the pipe character `|` to separate alternative rules for a
nonterminal. In the example below, `expression` has four different rules.

```ne
expression ->
    number "+" number
  | number "-" number
  | number "*" number
  | number "/" number
```

The keyword `null` stands for the **epsilon rule**, which matches nothing. The
following nonterminal matches zero or more `cow`s in a row, such as
`cowcowcow`:

```ne
a -> null | a "cow"
```

### Matching Rules

Syntax for matching input if you're not using a tokenizer.

  * `"if"` - match `if` literally
  * `"if"i` - match `if` case-insensitive (1)
  * `.` - match any symbol except newline
  * `[^]` - match anything including newline
  * `[a-zA-Z]` - match symbols in range (2)
  * `[^a-zA-Z]` - match symbols not in range
  * `:+` - match previous construction one or more time
  * `:*` - match zero times or more
  * `:?` - zero time or one time

(1) `i` suffix will *not* work with a lexer if you're using one. Your lexer
should use the `i` flag in its regexes instead.

(2) RegExp charsets will not work with [tokenizer](tokenizers).


### Postprocessors

By default, nearley wraps everything matched by a rule into an array. For
example, when `rule -> "tick" "tock"` matches the string `"ticktock"`, it
creates the "parse tree" `["tick", "tock"]`. Most of the time, however, you
need to process that data in some way: for example, you may want to filter out
whitespace, or transform the results into a custom JavaScript object.

For this purpose, each rule can have a *postprocessor*: a JavaScript function
that transforms the array and returns a "processed" version of the result.
Postprocessors are wrapped in `{% %}`s:

```ne
expression -> number "+" number {%
    function(data) {
        return {
            operator: "sum",
            leftOperand:  data[0],
            rightOperand: data[2] // data[1] is "+"
        };
    }
%}
number -> [0-9]:+ {% d => parseInt(d[0].join("")) %}
```

The rules above will parse the string `5+10` into `{ operator: "sum",
leftOperand: 5, rightOperand: 10 }`.

The postprocessor can be any function with signature `function(data, location,
reject)`. Here,

- `data: Array` is an array that contains the results of parsing each part of
  the rule. Note that it is still an array, even if the rule only has one part!
  You can use the built-in `{% id %}` postprocessor to convert a one-item array
  into the item itself.

  For **arrow function** users, a convenient pattern is to decompose the `data`
  array within the argument of the arrow function:
  ```ne
  expression ->
      number "+" number {% ([fst, _, snd]) => fst + snd %}
    | number "-" number {% ([fst, _, snd]) => fst - snd %}
    | number "*" number {% ([fst, _, snd]) => fst * snd %}
    | number "/" number {% ([fst, _, snd]) => fst / snd %}
  ```

- `location: number` is the index (zero-based) at which the rule match starts.
  You might use this to show the location of an expression in an error message.

  > Note: Many [tokenizers](tokenizers) provide line, column, and offset
  > information in the Token object. If you are using a tokenizer, then it is
  > better to use that information than the nearley-provided variable, which
  > would only tell you that it saw the nth _token_ rather than the nth
  > _character_ in the string.

- `reject: Object` is a unique object that you can return to signal that this
  rule doesn't *actually* match its input.

  Reject is used in some edge cases. For example, suppose you want sequences of
  letters to match variables, except for the keyword `if`. In this case, your
  rule may be
  ```ne
  variable -> [a-z]:+ {%
      function(d,l, reject) {
          const name = d[0].join('');
          if (name === 'if') {
              return reject;
          } else {
              return { name };
          }
      }
  %}
  ```

  > Warning: Grammars using `reject` are not context-free, and are often much
  > slower to parse. So, we encourage you not to use `reject` unless absolutely
  > necessary. You can usually use a tokenizer instead.

nearley provides one built-in postprocessor:

- `id` returns the first element of the `data` array. This is useful to
  extract the content of a single-element array: `foo -> bar {% id %}`

### More syntax: tips and tricks

#### Comments

Comments are marked with '#'. Everything from `#` to the end of a line is
ignored:

```ne
expression -> number "+" number # sum of two numbers
```

#### EBNF

nearley supports the `*`, `?`, and `+` operators from
[EBNF](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form) as shown:

```ne
batman -> "na":* "batman" # nananana...nanabatman
```

You can also use capture groups with parentheses. Its contents can be anything
that a rule can have:

```ne
banana -> "ba" ("na" {% id %} | "NA" {% id %}):+
```

### Macros

Macros allow you to create polymorphic rules:

```ne
# Matches "'Hello?' 'Hello?' 'Hello?'"
matchThree[X] -> $X " " $X " " $X
inQuotes[X] -> "'" $X "'"

main -> matchThree[inQuotes["Hello?"]]
```

Macros are dynamically scoped, which means they see arguments passed to parent
macros:

```ne
# Matches "Cows oink." and "Cows moo!"
sentence[ANIMAL, PUNCTUATION] -> animalGoes[("moo" | "oink" | "baa")] $PUNCTUATION
animalGoes[SOUND] -> $ANIMAL " " $SOUND # uses $ANIMAL from its caller

main -> sentence["Cows", ("." | "!")]
```

Macros are expanded at compile time and inserted in places they are used. They
are not "real" rules. Therefore, macros *cannot* be recursive (`nearleyc` will
go into an infinite loop trying to expand the macro-loop). They must also be
defined *before* they are used (except by other macros).

### Additional JS

For more intricate postprocessors, or any other functionality you may need, you
can include chunks of JavaScript code between production rules by surrounding
it with `@{% ... %}`:

```ne
@{%
const cowSays = require("./cow.js");
%}

cow -> "moo" {% ([moo]) => cowSays(moo) %}
```

Note that it doesn't matter where you add these; they all get hoisted to the
top of the generated code.

### Importing other grammars

You can include the content of other grammar files:

```ne
@include "../misc/primitives.ne" # path relative to file being compiled
sum -> number "+" number # uses "number" from the included file
```

There are some common nonterminals like "integer" and "double-quoted string"
that ship with nearley to help you prototype grammars efficiently. You can
include them using the `@builtin` directive:

```ne
@builtin "number.ne"
main -> int:+
```

(Note that we mean "efficient" in the sense that you can get them set up very
quickly. The builtins are _inefficient_ in the sense that they make your parser
slower. For a "real" project, you would want to switch to a lexer and implement
these primitives yourself!)

See the [`builtin/`](https://github.com/kach/nearley/tree/master/builtin) directory on Github for more details. Contributions are
welcome!

Note that including a file imports *all* of the nonterminals defined in it, as
well as any JS, macros, and configuration options defined there.

### What's next?

Now that you have a grammar, you're ready to [learn how to use it to build a
parser!](parser)
