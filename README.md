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

What?
-----
nearley uses the [Earley parsing algorithm](earley.md) to parse complex data structures easily.

Why?
----
nearley lets you define grammars in a **simple format**. Unlike Jison's tokenizer-and-parser approach, it uses a single set of definitions. Unlike PEG.js, this parser handles **left recursion** gracefully and warns you if your parse is ambiguous.

How?
----
To compile a parser, use the `nearleyc` command:

    npm install -g nearley
    nearleyc parser.ne

Run `nearleyc --help` for more options.

Making a Parser
---------------

A parser consists of several *nonterminals*, which are just various constructions. A nonterminal is made up of a series of either nonterminals or strings (enclose strings in "double quotes", and use backslash escaping like in JSON).

Anything from a `#` to the end of a line is ignored as a comment.

The following grammar matches a number, a plus sign, and another number:

    expression -> number "+" number

The first nonterminal you define is the one that the parser tries to parse.

A nonterminal can have multiple meanings, separated by pipes (`|`):

    expression -> number "+" number   |   number "-" number

Each meaning (called a *production rule*) can have a postprocessing function, that can format the data in a way that you would like:

    expression -> number "+" number {%
        function (data) {
            return data[0] + data[2]; // the sum of the two numbers
        }
    %}

`data` is an array whose elements match the nonterminals in order. The postprocessor `id` returns the first token in the match (literally `function(data) {data[0];}`).

The **epsilon rule** is the empty rule that matches nothing. The constant `null` is the epsilon rule, so:

    a -> null
        | a "cow"

will match 0 or more `cow`s in a row.

You can use valid RegExp charsets in a rule:

    not_a_letter -> [^a-zA-Z]


For more intricate postprocessors, or any other functionality you may need, you can include parts of literal JavaScript between production rules by surrounding it with `@{% ... %}`:

    @{% var makeCowWithString = require('./cow.js') %}
    cow -> "moo" {% function(d) {makeCowWithString(d[0]); } %}

Using a parser
--------------

A `Parser` object exposes the following simple API:

    var Parser = require("parser.js");
    var p = new Parser();
    p.feed("1+1");
    // p.results --> [ 2 ]

The `Parser` object can be fed data in parts with `.feed(data)`. You can then find an array of parsings with the `.results` property. If `results` is empty, then there are no parsings. If `results` contains multiple values, then that combination is ambiguous.

The incremental feeding design is inspired so that you can parse data from stream-like inputs, or even dynamic readline inputs. For example, to create a Python-style REPL where it continues to prompt you until you have entered a complete block.

    p.feed(prompt_user(">>> "));
    while (p.results.length < 1) {
        p.feed(prompt_user("... "));
    }
    console.log(p.results);

Catching errors
---------------

If there are no possible parsings, nearley will throw an error whose `offset` property is the index of the offending token.

    try {
        p.feed("1 + 2 + gorgonzola");
    } catch(parseError) {
        console.log(
            "Error at character " + parseError.offset
        ); // "Error at character 8"
    }


Contributing
------------

Clone, hack, PR. Tests live in `test/` and can be called with `npm test`. Make sure you read `test/profile.log` after tests run, and that nothing has died (parsing is tricky, and small changes can kill efficiency).

Nearley is MIT licensed.

A big thanks to Nathan Dinsmore for teaching me how to Earley, Aria Stewart for helping structure nearley into a mature module, and Robin Windels for bootstrapping the grammar.
