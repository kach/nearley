# Custom tokens and lexers

## Adding custom token matchers

Sometimes you might want a more flexible way of matching tokens, whether you're using `@lexer` or not.

Custom matchers can be defined in two ways: literal tokens and testable tokens. A
literal token matches exactly, while a testable token runs a function to test
whether it is a match or not.

```coffeescript
@{%
const tokenPrint = { literal: "print" };
const tokenNumber = { test: x => Number.isInteger(x) };
%}

# Matches ["print", 12, ";;"] if the input is an array with those elements.
main -> %tokenPrint %tokenNumber ";;"
```

## Writing a custom lexer

If you don't want to use [Moo](https://github.com/tjvr/moo), our recommended lexer/tokenizer, you can define your own. Either pass it using `@lexer myLexer` in the grammar, or in options to `Parser`:

```js
const nearley = require("nearley");
const grammar = require("./grammar");
const myLexer = require("./lexer");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { lexer: myLexer });
```

You lexer must have the following interface:

- `next() -> Token` return e.g. `{type, value, line, col, …}`. Only the `value` attribute is required.
- `save() -> Info` -> return an object describing the current line/col etc. This allows us to preserve this information between `feed()` calls, and also to support `Parser#rewind()`. The exact structure is lexer-specific; nearley doesn't care what's in it.
- `reset(chunk, Info)`: set the internal buffer to `chunk`, and restore line/col/state info taken from `save()`.
- `formatError(token)` -> return a string with an error message describing the line/col of the offending token. You might like to include a preview of the line in question.
- `has(tokenType)` -> return true if the lexer can emit tokens with that name. Used to resolve `%`-specifiers in compiled nearley grammars.
