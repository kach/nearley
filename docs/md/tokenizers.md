---
title: Tokenizers
---

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


## Custom tokens and lexers

There are two ways nearley can parse token streams.

### Custom token matchers

Aside from the lexer infrastructure, nearley provides a lightweight way to
parse arbitrary streams.

Custom matchers can be defined in two ways: *literal* tokens and *testable*
tokens. A literal token matches a JS value exactly (with `===`), while a
testable token runs a predicate that tests whether or not the value matches.

Note that in this case, you would feed a `Parser` instance an *array* of
objects rather than a string! Here is a simple example:

```coffeescript
@{%
const tokenPrint = { literal: "print" };
const tokenNumber = { test: x => Number.isInteger(x) };
%}

main -> %tokenPrint %tokenNumber ";;"

# parser.feed(["print", 12, ";;"]);
```

### Custom lexers

nearley recommends using a [moo](https://github.com/tjvr/moo)-based lexer.
However, you can use any lexer that conforms to the following interface:

- `next()` returns a token object, which could have fields for line number,
  etc. Importantly, a token object *must* have a `value` attribute.
- `save()` returns an info object that describes the current state of the
  lexer. nearley places no restrictions on this object.
- `reset(chunk, info)` sets the internal buffer of the lexer to `chunk`, and
  restores its state to a state returned by `save()`.
- `formatError(token)` returns a string with an error message describing a
  parse error at that token (for example, the string might contain the line and
  column where the error was found).
- `has(name)` returns true if the lexer can emit tokens with that name. This is
  used to resolve `%`-specifiers in compiled nearley grammars.

> Note: if you are searching for a lexer that allows indentation-aware
> grammars (like in Python), you can still use moo. See [this
> example](https://gist.github.com/nathan/d8d1adea38a1ef3a6d6a06552da641aa)
