## Accessing the internal parse table

If you are familiar with the Earley parsing algorithm, you can access the
internal parse table using `Parser.table` (this, for example, is how
`nearley-test` works). One caveat, however: you must pass the `keepHistory`
option to nearley to prevent it from garbage-collecting inaccessible columns of
the table.

```js
const nearley = require("nearley");
const grammar = require("./grammar");

const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar),
    { keepHistory: true }
);


parser.feed(...);
console.log(parser.table);
```
