                                             oooo                        
                                             `888                        
    ooo. .oo.    .ooooo.   .oooo.   oooo d8b  888   .ooooo.  oooo    ooo 
    `888P"Y88b  d88' `88b `P  )88b  `888""8P  888  d88' `88b  `88.  .8'  
     888   888  888ooo888  .oP"888   888      888  888ooo888   `88..8'   
     888   888  888    .o d8(  888   888      888  888    .o    `888'    
    o888o o888o `Y8bod8P' `Y888""8o d888b    o888o `Y8bod8P'     .8'     
                                                             .o..P'      
                                                             `Y8P'       


nearley.js
==========

Simple parsing for JavaScript.

What?
-----
nearley.js uses the [Earley parsing algorithm](http://en.wikipedia.org/wiki/Earley_parser) to parse complex data structures easily.

Why?
----
nearley.js lets you define grammars in a **simple format**. Unlike Jison's tokenizer-and-parser approach, I use a single set of definitions. Unlike PEG.js, this parser handles **left recursion** gracefully and warns you if your grammar is ambiguous (ambiguous grammars are slower and take up more memory). Finally, nearley.js generates tiny files, which won't affect performance even if they are unminified.

How?
----
To compile a parser, use the `nearleyc` command:

    npm install -g nearley
    nearleyc parser.ne

A parser consists of several *nonterminals*, which are just various constructions. A nonterminal is made up of a series of either nonterminals or strings (enclose strings in "double quotes", and use backslash escaping like in JSON). The following grammar matches a number, a plus sign, and another number:

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

    var parse = require("parser.js");
    console.log(parse("1+1")); // 2
    console.log(parse("cow")); // throws error: "nearley parse error"

Errors
------

A parse error will throw the string "nearley parse error".

You may get a warning saying your grammar is *ambiguous*. This means that there are multiple ways to parse the given input with the given grammar.

nearley.js does not support detailed error messages yet.