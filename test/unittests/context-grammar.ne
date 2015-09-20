program -> _ uc _ {% function (d) { return this.id(d[1]) } %}
        | _ lc _ {% function (d) { return this.id(d[1]) } %}

uc -> "toupper" _ string {% function (d) { return this.toUpper(d[2]) } %}

lc -> "tolower" _ string {% function (d) { return this.toLower(d[2]) } %}

string -> "'" [a-zA-Z ]:* "'" {% function (d) { return this.string(d[1]) } %}

_ -> null       {% function(d) { return this.null(); } %}
	| [\s] _    {% function(d) {return this.null(); } %}
