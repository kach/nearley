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
