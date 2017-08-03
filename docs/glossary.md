Glossary
--------

Parsing terminology gets very confusing very quickly. Here is a glossary that
can help us all communicate more effectively.

**token**: the smallest meaningful unit (the "words") of your language

**lexer**: a function that converts a sequence of *characters* to a sequence of
*tokens* (converts a sequence of letters and spaces to a sequence of words)

**string**: a sequence of *tokens*

**concatenation**: joining two strings by appending one to the other

**language**: a set of *strings*

**production rule**: a set of *strings* specified as a sequence of *symbols*,
such that the rule matches a string if it is a concatenation of strings matched
by the respective symbols

**symbol**: a generic term for a member of a *production rule*, either a
*nonterminal* or a *terminal*

**nonterminal**: a *symbol* that specifies a set of other *production rules*
that match

**terminal**: a *symbol* that directly specifies a set of *tokens* that match

**context-free grammar**: a set of *production rules* that together specify a
*language*

**context-free language**: a *language* that can be specified by a
*context-free grammar*

**Backus-Naur Form**: a set of conventions for describing and typesetting
context-free grammars

**recognizer**: a function that takes a *grammar* and a *string* and sees if
the grammar matches the string (it just says "yes" or "no")

**parser**: a function that takes a *grammar* and a *string* and returns a
*derivation* of that string from that grammar

**derivation**: a way to apply the production rules of a *grammar* recursively
to obtain a *string*

**parse tree**: a representation of a *derivation* as a tree

**abstract syntax tree (AST)**: a version of a *parse tree* that has undergone
some *postprocessors* to simplify it (for example, an AST is likely to omit
whitespace)

**preprocessor**: the dialect of JavaScript targeted by `nearleyc`; for
example, you can emit TypeScript code instead of plain JavaScript (not to be
confused with *postprocessor*)

**postprocessor**: a function associated with a production rule, whose purpose
is to transform a *parse tree* into an AST, making simplifications along the
way --- for example, by omitting whitespace (not to be confused with
*preprocessor*)

**ambiguity**: a situation where there exist more than one *derivations* for a
single *string* --- unlike most *parser* libraries, *nearley* returns all
possible derivations

**Earley algorithm**: a *parsing* algorithm developed by Jay Earley in 1968,
which can efficiently parse all *context-free grammars*

**Earley table**: the intermediate data structure created by the Earley
algorithm, where each new token creates a new column

**Leo optimization**: a trick we can use to optimize right-recursion, making it
just as efficient to parse as *left-recursion*

**left-recursion**: a situation where a nonterminal refers to a production rule
whose first symbol matches the same nonterminal

**epsilon**: the empty production rule, matching only the empty string

**nullable rule**: a production rule that matches the empty string

**nearley**: a *parser* that parses *context-free languages*, along with
several additional utilities for building languages
