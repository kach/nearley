@preprocessor coffee
@{%
test = (d)->d.join("")
%}
r -> l n
l -> l [A-Z] {% test %} | null
n -> n [0-9] {% (d) ->
  d[0] + d[1]
%} | null
