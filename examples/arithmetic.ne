main -> _ E _ {% function(d) {return d[1]; } %}

E -> float {% id %}
	| E _ "+" _ float {% function(d) {return d[0] + d[4]; } %}
	| E _ "-" _ float {% function(d) {return d[0] - d[4]; } %}


float -> int "." int {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int {% function(d) {return parseInt(d[0])} %}

digit -> [0-9] {% id %}

int -> digit {% id %}
	| int digit {% function(d) {return d[0] + d[1]} %}


_ -> null
	| _s _
	
