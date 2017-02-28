# Test for balancing parentheses, brackets, square brackets and pairs of "<" ">"

@{% function TRUE (d) { return true; } %}

P ->
      "(" E ")" {% TRUE %}
    | "{" E "}" {% TRUE %}
    | "[" E "]" {% TRUE %}
    | "<" E ">" {% TRUE %}

E ->
      null
    | "(" E ")" E
    | "{" E "}" E
    | "[" E "]" E
    | "<" E ">" E
