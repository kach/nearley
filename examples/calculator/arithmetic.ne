# How to Implement Lexical Analysis in Tools Whithout a separated Lexer
# To use it run: 
# nearleyc arithmetic-parenthesis.ne -o grammar.js && export NODE_PATH=$NODE_PATH:`npm root -g` && node calculator.js
# This is a nice little grammar to familiarize yourself with the nearley syntax.

# It parses valid calculator input
#   ln (3 + 2*(8/e - sin(pi/5)))
# is valid input.

@{%
const bin = (([x, op, y]) => op(x,y));
const Null = (d => null);
const fac = n => (n===0)?1:n*fac(n-1);
const unaryPost = (([p, op]) => op(p));
const funApply = ([fun, arg]) => fun(arg);
%}

main => null {% d => "" %} # Allow for empty lines
    | AS _ {% function(d) {return d[0]; } %}

# PEMDAS!
# We define each level of precedence as a nonterminal.

# Addition and subtraction
AS -> AS PLUS MD  {% bin %}  # Prefer this syntax
    | AS MINUS MD {% bin %}
    | MD          {% id %}

# Multiplication and division
MD -> MD MULT E  {% bin %}
    | MD DIV E   {% bin %}
    | E          {% id %}

# Exponents
E -> F EXP E    {% bin %}
    | F         {% id %}

# Factorial 
F ->  P FACTORIAL    {% unaryPost %}
    | P              {% id %} 

# Fixed "bug" sinpi

P -> Q
    | FLOAT     {% id %}
    | SIN  Q    {% funApply %}
    | COS Q     {% funApply %}
    | TAN Q     {% funApply %}
    | ASIN Q    {% funApply %}
    | ACOS Q    {% funApply %}
    | ATAN Q    {% funApply %}
    | PI        {% id %}
    | EULER     {% id %}
    | SQRT Q    {% funApply %}
    | LN Q      {% funApply %}

# Parentheses
Q ->  LP AS RP  {% ([lp, as, rp]) => as %}

##### LEXICAL ANALYSIS #################################################

# I use `float` to basically mean a number with a decimal point in it
FLOAT -> _ float   {% d => d[1] %} 
float ->
      int "." int  {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int          {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+     {% function(d) {return d[0].join(""); } %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*        {% function(d) {return null; } %}

PLUS -> _ "+"      {% function(d) {return ((a,b) => a+b); } %}
MINUS -> _ "-"     {% function(d) {return ((a,b) => a-b); } %}
MULT -> _ "*"      {% function(d) {return ((a,b) => a*b); } %}
DIV -> _ "/"       {% function(d) {return ((a,b) => a/b); } %}
EXP -> _ "^"       {% function(d) {return ((a,b) => Math.pow(a,b)); } %}
FACTORIAL -> "!"   {% d => fac %}
LP -> _ "("        {% Null %}
RP -> _ ")"        {% Null %}
SIN -> _ "sin"i    {% d => Math.sin %}
COS -> _ "cos"i    {% d => Math.cos %}
TAN -> _ "tan"i    {% d => Math.tan %}
ASIN -> _ "asin"i  {% d => Math.asin %}
ACOS -> _ "acos"i  {% d => Math.acos %}
ATAN -> _ "atan"i  {% d => Math.atan %}
PI -> _ "pi"i      {% d => Math.PI %}
EULER -> _ "e"i    {% d => Math.E  %}
SQRT -> _ "sqrt"i  {% d => Math.sqrt %}
LN -> _ "ln"i      {% d => Math.log %}
