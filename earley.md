Earley Parsing Algorithm
========================
The magic of parsing, explained to Muggles.

Primer: Backus-Naur Form
------------------------

The Earley algorithm parses a string (or any other form of a stream of tokens) based on a [Backus-Naur Form](http://en.wikipedia.org/wiki/Backus–Naur_Form) grammar. A BNF grammar consists of a set of **production rules**, which are expansions of **nonterminals**.

An example of a BNF grammar is as follows:

    # We match a sentence (first nonterminal declared)
    sentence     -> noun verb
                  | interjection exclamation
        
    noun         -> "cow"  | "dog"
    verb         -> "eats" | "burps"
    interjection -> "hey"
    
    exclamation  -> "!"

This example will match `cow eats`, `hey!`, and `dog burps`, among others.

The **nonterminals** were `sentence`, `noun`, `verb`, `interjection`, and `exclamation`.

The **literals** were `cow`, `dog`, `eats`, `burps`, `hey`, and `!`.

The literals and nonterminals together are **tokens**.

The **production rules** followed the `->`s. The `|`s delimited different expansions. Thus, `noun -> "cow"` and `noun -> "dog"` are separate production rules.

For the rest of this guide, we use the following simple, recursive grammar:

    E -> "(" E ")"
       | null

this matches an arbitrary number of balanced parentheses: ` `, `()`, `(())`, etc.

You cannot write a regular expression for this example.

Algorithm
---------
Earley works by producing a table of partial parsings.

The nth column of the table contains all possible ways to parse `s[:n]`, the first *n* characters of *s*. Each parsing is represented by the relevant production rule, and a **marker** denoting how far we have parsed. This is represented with a dot `•` character placed after the last parsed token.

Consider the parsing of ths string `()` with the grammar `E` above. Column 0 of the table looks like:

    # COL 0
    1. E -> • "(" E ")"
    2. E -> • null

which indicates that we are expecting either of those two sequences.

We now proceed to process each entry (in order) as follows:

1. If the next token (the token after the marker `•`) is `null`, insert a new entry, which is identical excpept that the marker is incremented. (The `null` token doesn't matter.) Then re-process according to these rules.
2. If the next token is a nonterminal, insert a new entry, which expects this nonterminal.
3. If there is no expected token (that is, the marker is all the way at the end), then we have parsed the nonterminal completely. Thus, find the rule that expected this nonterminal (as a result of rule 2), and increment its marker.

Example!
--------

Following this procedure for Column 0, we have:

    # COL 0 [processed]
    1. E -> • "(" E ")"
    2. E -> • null
    3. E -> null •

Now, we consume a character from our string. The first character is `"("`. We bring forward any entry in the previous column that expects this character, incrementing the marker. In this case, it is only the first entry of column 0. Thus, we have:

    # COL 1, consuming "("
    1. E -> "(" • E ")" [from col 0 entry 1]

Processing, we have:

    # COL 1
    
    # brought from consuming a "("
    1. E -> "(" • E ")" [from col 0 entry 1]
    
    # copy the relevant rules for the E expected by
    # the first entry
    2. E -> • "(" E ")" [from col 1 entry 1]
    3. E -> • null [from col 1 entry 1]
    
    # increment the null rule
    4. E -> null • [from col 1 entry 3]
    
    # entry 4 is completed, so we increment entry 1
    5. E -> "(" E • ")" [from col 0 entry 1]

Notice how we must keep track of where each entry was added so that we know which entry to increment when it is completed.

Next, we consume a `")"`, the second (and last) character of our string. We have:

    # COL 2, consuming ")"
    
    # brought from consuming a ")"
    1. E -> "(" E ")" • [from col 0 entry 1]

Nothing further can be done, so the parsing is complete. We now find entries that are complete and created from an entry in column 0. (That means we have a parsing from the beginning of the string to the end). Since we have such an entry in column 2, this represents the parsing.

Finale
------
Nearley parses using the above algorithm, but giving each entry "baggage", namely the parsed data as a tree structure. When we finish an entry (and are about to process it with rule 3), we apply the postprocessor function to the baggage. Once we determine a parsing, we can reveal--with a flourish--the postprocessed data to be used by the user.

Parting words
-------------
If we had multiple entries that worked in the end, there would be multiple parsings of the grammar. This means the grammar is **ambiguous**, and this is generally a very bad sign. It is analogous to the confusion generated when one says

> I'm really worried Christopher Nolan will kill a man dressed like a bat in his next movie. (The man will be dressed like a bat, I mean. Christopher Nolan won't be, probably.)