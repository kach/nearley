@preprocessor coffee
@{%
test = (d)->d.join("")
%}

p -> p [A-Z] {% test %} | null
