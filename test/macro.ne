elide[X] -> "(" list[$X {% id %}] ")" {% function(d) {return d[1]; } %}
list[X]  -> $X ("," $X {% function(d) {return d[1]; } %}):*
            {% function(d) {return [d[0]].concat(d[1]); } %}

main -> elide[word {% id %}]:+ {% id %}
# Example input: "(this,means,war)(vini,vidi,vici)"

word -> [\w]:+ {% function(d) {return d[0].join("");} %}
