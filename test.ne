E -> _ float _ "+" _ float _ {% function(d) {return d[1] + d[5]} %}
	| _ float _ "-" _ float _ {% function(d) {return d[1] - d[5]} %}
	
float -> int "." int {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int {% function(d) {return parseInt(d[0])} %}

digit -> _09 {% id %}

int -> digit {% id %}
	| int digit {% function(d) {return d[0] + d[1]} %}


_ -> null
	| _s _