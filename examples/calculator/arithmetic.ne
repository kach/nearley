main -> _ AS _ {% function(d) {return d[1]; } %}

# PEMDAS

P -> "(" _ AS _ ")" {% function(d) {return d[2]; } %}
    | N             {% id %}

E -> P _ "^" _ E    {% function(d) {return Math.pow(d[0], d[4]); } %}
    | P             {% id %}

MD -> MD _ "*" _ E  {% function(d) {return d[0]*d[4]; } %}
    | MD _ "/" _ E  {% function(d) {return d[0]/d[4]; } %}
    | E             {% id %}

AS -> AS _ "+" _ MD {% function(d) {return d[0]+d[4]; } %}
    | AS _ "-" _ MD {% function(d) {return d[0]-d[4]; } %}
    | MD            {% id %}

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

float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]        {% id %}
	| int [0-9]     {% function(d) {return d[0] + d[1]} %}

_ -> null       {% function(d) {return null; } %}
	| [\s] _    {% function(d) {return null; } %}
