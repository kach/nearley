# Making a [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) for your grammar

- The parser object can be fed data in parts with `.feed(data)`.
- If `parser.results` is empty, then there are no parsings yet.

These two features allow you to parse data from stream-like inputs, or even dynamic readline inputs.

Let's make a Python-style REPL which continues to prompt you until you have entered a complete block:

```js
parser.feed(prompt(">>> "));
while (parser.results.length < 1) {
    parser.feed(prompt("... "));
}

console.log(parser.results);
```
