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

