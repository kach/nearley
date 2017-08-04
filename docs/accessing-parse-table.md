# Accessing the internal parse table

The `Parser` constructor takes an optional last parameter, `options`,
which is an object with the following possible keys:

- `keepHistory` (boolean, default `false`) - whether to preserve and expose the internal state
- `lexer` (object) - custom lexer, overrides `@lexer` in the grammar

If you are familiar with the Earley parsing algorithm and are planning to do something exciting with the parse table, set `keepHistory`:

```js
const nearley = require("nearley");
const grammar = require("./grammar");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true });

// ...

// After feeding data:
console.log(parser.table);
```
