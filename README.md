                                             oooo
                                             `888
    ooo. .oo.    .ooooo.   .oooo.   oooo d8b  888   .ooooo.  oooo    ooo
    `888P"Y88b  d88' `88b `P  )88b  `888""8P  888  d88' `88b  `88.  .8'  
     888   888  888ooo888  .oP"888   888      888  888ooo888   `88..8'
     888   888  888    .o d8(  888   888      888  888    .o    `888'
    o888o o888o `Y8bod8P' `Y888""8o d888b    o888o `Y8bod8P'     .8'
                                                             .o..P'
                                                             `Y8P'


nearley
==============

Simple parsing for node.js.

What is nearley?
----------------
nearley uses the Earley parsing algorithm to parse complex data structures easily. nearley is über-fast and really powerful. It can parse anything you throw at it.

Why do I care?
--------------

nearley can parse what other JS parse engines cannot, because it uses a different algorithm. The Earley algorithm is *general*, which means it can handle *any* grammar you can define in BNF. In fact, the nearley syntax is written in *itself* (this is called bootstrapping).

PEGjs and Jison are recursive-descent based, and so they will choke on a lot of grammars, in particular [left recursive ones](http://en.wikipedia.org/wiki/Left_recursion).

nearley also has capabilities to catch errors gracefully, and detect ambiguous grammars (grammars that can be parsed in multiple ways).

Installation and Usage
----------------------
To compile a parser, use the `nearleyc` command:

    npm install -g nearley
    nearleyc parser.ne

Run `nearleyc --help` for more options.

To use a generated grammar in a node runtime, install `nearley` as a module:

    npm install nearley
    ...
    var nearley = require("nearley");
    var grammar = require("./my-generated-grammar.js");

To use a generated grammar in a browser runtime, include `nearley.js` (you can hardlink from Github if you want):

    <script src="https://raw.githubusercontent.com/Hardmath123/nearley/master/lib/nearley.js"></script>
    <script src="my-generated-grammar.js"></script>


Parser specification
--------------------

A parser consists of several *nonterminals*, which are constructions in a language. A nonterminal is made up of a series of either other nonterminals or strings. In nearley, you define a nonterminal by giving its name and its expansions.

The following grammar matches a number, a plus sign, and another number (anything from a `#` to the end of a line is ignored as a comment):

    expression -> number "+" number # pretend `number` is defined elsewhere

The first nonterminal you define is the one that the parser tries to parse. Define other helpers below it.

A nonterminal can have multiple expansions, separated by pipes (`|`):

    expression ->
          number "+" number
        | number "-" number
        | number "*" number
        | number "/" number

### Postprocessors

Each meaning (called a *production rule*) can have a postprocessing function, that can format the data in a way that you would like:

    expression -> number "+" number {%
        function (data, location) {
            return ["sum", data[0], data[2]];
        }
    %}

`data` is an array whose elements match the nonterminals in order. The postprocessor `id` returns the first token in the match (literally `function(data) {data[0];}`).

`location` is the index at which that rule was found. Retaining this information in a syntax tree is useful if you're writing an interpreter and want to give fancy error messages for runtime errors. (This feature is **experimental**.)

### Epsilon rules

The **epsilon rule** is the empty rule that matches nothing. The constant `null` is the epsilon rule, so:

    a -> null
        | a "cow"

will match 0 or more `cow`s in a row.

### Charsets

You can use valid RegExp charsets in a rule:

    not_a_letter -> [^a-zA-Z]

The `.` character can be used to represent "any character".

### Other

For more intricate postprocessors, or any other functionality you may need, you can include parts of literal JavaScript between production rules by surrounding it with `@{% ... %}`:

    @{% var makeCowWithString = require('./cow.js') %}
    cow -> "moo" {% function(d) {makeCowWithString(d[0]); } %}

Note that it doesn't matter where you define these; they all get hoisted to the top of the generated code.

Using a parser
--------------

nearley exposes the following API:

    var grammar = require("generated-code.js");
    var nearley = require("nearley");

    // Create a Parser object from our grammar.
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    // Parse something
    p.feed("1+1");
    // p.results --> [ ["sum", "1", "1"] ]

The `Parser` object can be fed data in parts with `.feed(data)`. You can then find an array of parsings with the `.results` property. If `results` is empty, then there are no parsings. If `results` contains multiple values, then that combination is ambiguous.

The incremental feeding design is inspired so that you can parse data from stream-like inputs, or even dynamic readline inputs. For example, to create a Python-style REPL where it continues to prompt you until you have entered a complete block.

    p.feed(prompt_user(">>> "));
    while (p.results.length < 1) {
        p.feed(prompt_user("... "));
    }
    console.log(p.results);

Examples
--------
You can read [the calculator example](examples/calculator/arithmetic.ne) to get a feel for the syntax.

Catching errors
---------------

If there are no possible parsings, nearley will throw an error whose `offset` property is the index of the offending token.

    try {
        p.feed("1+gorgonzola");
    } catch(parseError) {
        console.log(
            "Error at character " + parseError.offset
        ); // "Error at character 2"
    }


Contributing
------------

Clone, hack, PR. Tests live in `test/` and can be called with `npm test`. Make sure you read `test/profile.log` after tests run, and that nothing has died (parsing is tricky, and small changes can kill efficiency).

Nearley is MIT licensed.

A big thanks to Nathan Dinsmore for teaching me how to Earley, Aria Stewart for helping structure nearley into a mature module, and Robin Windels for bootstrapping the grammar.

Further reading
---------------

- Read my [blog post](http://hardmath123.github.io/earley.html) to learn more about the algorithm.
- Read about [Marpa](http://savage.net.au/Marpa.html) to learn more than you ever thought you wanted to know about parsing.
