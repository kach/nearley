# This is a nice little grammar to familiarize yourself
# with the nearley syntax.

# It parses valid calculator input, obeying OOO and stuff.
#   ln (3 + 2*(8/e - sin(pi/5)))
# is valid input.

# This is (hopefully) pretty self-evident.

# `main` is the nonterminal that nearley tries to parse, so
# we define it first.
# The _'s are defined as whitespace below. This is a mini-
# -idiom.

main -> _ AS _ {% function(d) {return d[1]; } %}

# PEMDAS!
# We define each level of precedence as a nonterminal.

# Parentheses
P -> "(" _ AS _ ")" {% function(d) {return d[2]; } %}
    | N             {% id %}

# Exponents
E -> P _ "^" _ E    {% function(d) {return Math.pow(d[0], d[4]); } %}
    | P             {% id %}

# Multiplication and division
MD -> MD _ "*" _ E  {% function(d) {return d[0]*d[4]; } %}
    | MD _ "/" _ E  {% function(d) {return d[0]/d[4]; } %}
    | E             {% id %}

# Addition and subtraction
AS -> AS _ "+" _ MD {% function(d) {return d[0]+d[4]; } %}
    | AS _ "-" _ MD {% function(d) {return d[0]-d[4]; } %}
    | MD            {% id %}

# A number or a function of a number
N -> float          {% id %}
    | "sin" _ P     {% function(d) {return Math.sin(d[2]); } %}
    | "cos" _ P     {% function(d) {return Math.cos(d[2]); } %}
    | "tan" _ P     {% function(d) {return Math.tan(d[2]); } %}
    
    | "asin" _ P    {% function(d) {return Math.asin(d[2]); } %}
    | "acos" _ P    {% function(d) {return Math.acos(d[2]); } %}
    | "atan" _ P    {% function(d) {return Math.atan(d[2]); } %}

    | "pi"          {% function(d) {return Math.PI; } %}
    | "e"           {% function(d) {return Math.E; } %}
    | "sqrt" _ P    {% function(d) {return Math.sqrt(d[2]); } %}
    | "ln" _ P      {% function(d) {return Math.log(d[2]); }  %}

# I use `float` to basically mean a number with a decimal point in it
float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% function(d) {return null; } %}
