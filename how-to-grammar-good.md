A lot of people have pointed out to me that writing grammars for
[nearley](http://hardmath123.github.io/nearley/) is *hard*. The thing is,
writing grammars is, in general, very hard. It doesn't help that certain
grammar-related problems are provably undecidable.

As with all of programming, grammar-writing is guided by instinct and pattern
recognition (on the part of the human, in this case!). This guide is meant to
walk through some common idioms, ideas, anti-patterns and pitfalls, and
hopefully make you a confident grammarian. Treat it more as a styleguide than a
tutorial.

It might be worth reading [Better Earley than
Never](http://hardmath123.github.io/earley.html) first, to understand the
algorithm and some basic concepts. From here on out, I'm assuming you know what
*regular expression*, *Backus Naur Form*, *context free grammar*, *terminal*,
*nonterminal*, and *ambiguous grammar* mean. You should know nearley syntax
well enough to understand what something like

```
int -> [0-9]        {% id %}
    | int [0-9]     {% function(d) {return d[0] + d[1]} %}
```

means (though I like to pride myself on the readability of nearley grammar...).

### Structure

Your grammar should be structured from the top down. The first few rules in a
file should describe a general outline, and tiny details (terminals for
whitespace, literals etc.) should be at the bottom. For example, if you're
writing a parser for Scheme, you would start with

    Sourcefile -> (S-expression | Comment):*

and then fill out what `s-expression` and `comment` mean. Most of the time,
rules defined higher in the file reference rules defined lower down, and rules
defined near the bottom rarely ever reference rules near the top.

### Nonterminal names

Give your nonterminals useful names--mostly nouns that describe the string it
will match. By convention, we use `_` for optional whitespace and `__` for
mandatory whitespace: it makes it easy to write rules like

    "(" _ expression _ ")"

You can explicitly mark a nonterminal as optional or repetitive by postfixing
its name with `?` and `+` (respectively)--as in `statementlist+` or `comment?`.
Note that this has no semantic value: use nearley's EBNF modifiers (`:*`, `:+`,
`:?`) for that.

### Don't roll your own unroller

If you want to match one or more of a nonterminal, use an EBNF modifier. It's
semantically legible, contextually appropriate and (most importantly) easy.
It's very easy to mess up and create an exponentially ambiguous monstrosity
such as

    lotsofletters -> "a" | lotsofletters lotsofletters

### Postprocess or dispose

nearley saves a nested array structure by default, but most of the time that's
not what you want. For things like whitespace, you want to throw away all that
useless information for memory efficiency, so use a postprocessor that just
returns `null`. For syntactic sugar and stuff, construct object literals so
that the code that processes your AST is relatively independent of your
grammar. Constructing object literals also lets you discard junk (parens,
etc.).

### Remember, charclasses aren't regexes

The `[a-z]` syntax only allows you to use regex-style character classes, not
actual regular expressions. Nearley fundamentally does not support regexes as
terminals. Use EBNF modifiers instead--they do what you want.

### Debug with nearley-test

Use the `nearley-test` script (installs alongside `nearleyc`) to debug your
grammars. It lets you inspect the parse tables, and see all the parsings, or
the point of failure. This is invaluable when you have a subtle ambiguity
issue.

### Don't shy away from left recursion

You were a good little student and you payed attention to your professors when
they told you never to write grammars like:

    a -> a "something"

because a naïve recursive-descent parser would bork in an infinite loop.
Nearley, of course, is much better, so you don't have to worry about that. If
you're paranoid about efficiency, you should actually prefer left recursion
over right recursion (`a -> "something" a`) because it's very slightly faster.
In any case, that's how you deal with left or right associativity for binary
operators.

### Do shy away from left recursion

...if you're using it where the EBNF `:*` or `:+` makes more sense!

### Operator precedence is not black magic

Here's how you do it: you start with your lowest-precedence operator and work
your way up to your highest precedence ones. Each operator gets its own
nonterminal:

    math -> sum
    sum -> sum ("+"|"-") product | product
    product -> product ("*"|"/") exp | exp
    exp -> number "^" exp | number # this is right associative!

It should be pretty clear how this works, and how to extend it to different
types of operators. The main thing is to be careful with your associativity
direction. Be careful not to write `op -> op "$" op`, because that's ambiguous.

Introducing non-conflicting unary negation (`"5 * -5"`) is left as a trivial
exercise for the enterprising reader.

### Comment your grammars

It's very easy to come back to a grammar a week later and have no idea what
it's doing. Leave comments that explain precisely what each nonterminal
matches, since a clear description will help you debug things in the future.

### Use whitespace prettily

Align your `->`s and your `|`s and your `{% ... %}`s. Future retinas will thank
you.

### Parsing an established language? Cheat!

Almost all standards publish syntax guides with an accompanying diagram in
(E)BNF. It's worth it to Google around for this. With just a bit of common
sense, you should be able to transliterate it to a `.ne` file.

---

Again, grammar-writing is largely about instinct and experience. The more you
write, the more you'll understand how it goes, and the faster you'll be able to
prototype and design.
