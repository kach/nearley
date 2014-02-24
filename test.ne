E -> _ float _ "+" _ float _ {% function(d) {return d[1] + d[5]} %}
	| _ float _ "-" _ float _ {% function(d) {return d[1] - d[5]} %}
	
float -> int "." int {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int {% function(d) {return parseInt(d[0])} %}

digit -> "0" {% id %}
	| "1" {% id %}
	| "2" {% id %}
	| "3" {% id %}
	| "4" {% id %}
	| "5" {% id %}
	| "6" {% id %}
	| "7" {% id %}
	| "8" {% id %}
	| "9" {% id %}

int -> digit {% id %}
	| int digit {% function(d) {return d[0] + d[1]} %}


_ -> null
	| " " _
	| "\t" _
	| "\n" _