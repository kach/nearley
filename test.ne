E -> float "+" float {% function(d) {return d[0] + d[2]} %}
	| float "-" float {% function(d) {return d[0] - d[2]} %}
	
float -> int "." int {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| int {% function(d) {return parseInt(d[0])} %}

digit -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
int -> digit
	| int digit {% function(d) {return d[0] + d[1]} %}