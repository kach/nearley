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
nearley uses the [Earley parsing algorithm](http://en.wikipedia.org/wiki/Earley_parser) to parse complex data structures easily.

Why?
----
nearley lets you define grammars in a **simple format**. Unlike Jison's tokenizer-and-parser approach, I use a single set of definitions. Unlike PEG.js, this parser handles **left recursion** gracefully and warns you if your parse is ambiguous.

How?
----
To compile a parser, use the `nearleyc` command:

    npm install -g nearley
    nearleyc parser.ne

Run `nearleyc --help` for more options.

Making a Parser
---------------

A parser consists of several *nonterminals*, which are just various constructions. A nonterminal is made up of a series of either nonterminals or strings (enclose strings in "double quotes", and use backslash escaping like in JSON).

Anything beyond a `#` to the end of a line is ignored as a comment.

The following grammar matches a number, a plus sign, and another number:

    expression -> number "+" number

The first nonterminal you define is the one that the parser tries to parse.

A nonterminal can have multiple meanings, separated by pipes (`|`):

    expression -> number "+" number   |   number "-" number

Finally, each meaning (called a *production rule*) can have a postprocessing function, that can format the data in a way that you would like:

    expression -> number "+" number {%
        function (data) {
            return data[0] + data[2]; // the sum of the two numbers
        }
    %}

`data` is an array whose elements match the nonterminals in order.

To use the generated parser, use:

    var Parser = require("parser.js");
    var parser = new Parser();
    parser.on('result', function (result) {
        // result is 2
    });
    parser.end('1+1');

    var parser2 = new Parser();
    parser2.on('result', function (result) {
        // never reached
    }).on('error', function (err) {
        // err is an Error("nearley parse error")
    });
    parser2.end('cow');


The **epsilon rule** is the empty rule that matches nothing. The constant `null` is the epsilon rule, so:

    a -> null
        | a "cow"

will match 0 or more `cow`s in a row.

The following constants are also defined:

| Constant | Meaning | Regex Equivalent |
| -------- | ------- | ---------------- |
| `_char` | Any character | `/./` |
| `_az` | Any lowercase letter | `/[a-z]/` |
| `_AZ` | Any uppercase letter | `/[A-Z]/` |
| `_09` | Any digit | `[0-9]` |
| `_s`  | A whitespace character | `/\s/` | 

Errors
------

A parse error will emit `Error("nearley parse error")`, which you can catch like this:

    parser.on('error', function (err) {
        if (err.message === "nearley parse error") {
            // it was a parse error!
        }
    });
