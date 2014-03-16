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
nearley.js lets you define grammars in a **simple format**. Unlike Jison's tokenizer-and-parser approach, I use a single set of definitions. Unlike PEG.js, this parser handles **left recursion** gracefully and warns you if your grammar is ambiguous (ambiguous grammars are slower and take up more memory). Finally, nearley.js generates tiny files (whose length is directly proportional to the input length), so they won't affect performance even if they are left unminified.

How?
----
nearley ships with a parser compiler, that compiles a human-readable parser specification into a JavaScript file.

To compile a parser, use the `nearleyc` command:

    npm install -g nearley
    nearleyc parser.ne

Run `nearleyc --help` for more options.

Making a Parser
---------------

The basic structure for a nearley parser is

    nonterminal -> expansion {% postprocessor %} | another_expansion ...
    another_nonterminal -> ...

nearley parsers are defined as context-free grammars, which consist of several **nonterminals**. Nonterminals are just various lists of symbols. A nonterminal is made up of a concatenation of either other nonterminals or strings (enclose strings in "double quotes", and use backslash escaping like in JSON). A nonterminal can have multiple such expansions, separated by pipes (`|`).

The following grammar matches a number, a plus sign, and another number:

    expression -> number "+" number

Similarly, the following recursive grammar matches `(1)`, `((1))`, `(((1)))`, etc:

    parens -> "1" | "(" parens ")"

The first nonterminal you define is the one that the parser tries to parse (the **start symbol**).

Finally, each meaning (called a *production rule*) can have a postprocessing function, that can format the data in a way that you would like:

    expression -> number "+" number {%
        function (data) {
            // data is [aNumber, "+", aNumber]
            // we return the sum of the two numbers
            return data[0] + data[2];
        }
    %}

`data` is an array whose elements match the expansion of the nonterminal in order.

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

Using a parser
==============

To use a generated parser, use:

    var parse = require("parser.js");
    console.log(parse("1+1")); // 2
    console.log(parse("cow")); // throws error: "nearley parse error"

A parse error will throw the string "nearley parse error", which you can catch like this:

    try {
        // try to parse something
    } catch(err) {
        if (err === "nearley parse error") {
            // it was a parse error!
        }
    }

Past changes
------------
* 0.0.1: Initial release
* 0.0.2: Null rule
* 0.0.3: Predefined charsets
