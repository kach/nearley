# Generating CST and AST

Here's one way of generating a [parse tree](https://en.wikipedia.org/wiki/Parse_tree) before doing clever stuff with it:

```coffeescript

@{%
const createNode = type => data => ({ type, data });
%}

main -> foo (qux):+ {% createNode("main") %}
foo  -> bar         {% createNode("foo") %}
bar  -> qux         {% createNode("bar") %}
```

This way, your grammar is still readable, with no excessive transformation logic, and a lightweight parse tree is preserved for you:

```js
const nearley = require("nearley");
const grammar = require("./grammar");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed("input text");
const tree = parser.results[0];

console.log(tree); // {type: "main", data: [{type: "foo", data: []}, ...]}
```

Here's an example of how to transform the tree using the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern):

```js
const visitor = {
    main: data => ({ type: "Program", statements: data.map(transform) }),
    foo:  data => ({ type: "FooStatement", arguments: transform(data[0]) }),
    // ...
};

const transform = node => visitor[node.type](node.data);

// Transforming the top-level node causes a domino effect, and you get back a fully transformed tree.
console.log(transform(tree)); // {type: "Program", statements: [...]}
```
