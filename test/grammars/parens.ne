# mainly for profiling

@{%
/* This comment should exist. */
var f = 0;
%}


p -> "(" p ")" | [a-z] q {% function(d) {return 1;} %}
q -> null
    | q ("c" "ow")
