# Matches various kinds of string literals
@builtin "postprocessors.ne"

# Double-quoted string
dqstring -> "\"" strchar:* "\"" {% nth(1) %}
sqstring -> "'"  strchar:* "'"  {% nth(1) %}
btstring -> "`"  [^`]:*    "`"  {% function(d) {return d[1].join(""); } %}

strchar -> [^\\"'\n] {% id %}
    | "\\" strescape {%
    function(d) {
        return JSON.parse("\""+d.join("")+"\"");
    }
%}

strescape -> ["'\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
    function(d) {
        return d.join("");
    }
%}
