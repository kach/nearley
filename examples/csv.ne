# csv.ne
# from the Antlr grammar at: http://www.antlr3.org/grammar/list.html
# see also: https://github.com/antlr/grammars-v4

@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
%}

file              -> header newline rows             {% function (d) { return { header: d[0], rows: d[2] }; } %}

header            -> row                             {% id %}

rows              -> row
                   | rows newline row                {% appendItem(0,2) %}

row               -> field
                   | row "," field                   {% appendItem(0,2) %}

field             -> unquoted_field                  {% id %}
                   | "\"" quoted_field "\""          {% function (d) { return d[1]; } %}

quoted_field      -> null                            {% emptyStr %}
                   | quoted_field quoted_field_char  {% appendItemChar(0,1) %}

quoted_field_char -> [^"]                            {% id %}
                   | "\"" "\""                       {% function (d) { return "\""; } %}

unquoted_field    -> null                            {% emptyStr %}
                   | unquoted_field char             {% appendItemChar(0,1) %}

char              -> [^\n\r",]                       {% id %}

newline           -> "\r" "\n"                       {% empty %}
                   | "\r" | "\n"                     {% empty %}
