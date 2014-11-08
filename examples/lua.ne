# Adapted from http://www.lua.org/manual/5.2/manual.html
# No comments implemented yet, because lua comments are hard.
# Additionally, this was written using an older version of
# nearley. Use at your own peril (or fix it and PR!)
 
Chunk -> _ Block _
 
Block -> _Block
	| _Block __ ReturnStat
 
ReturnStat -> "return" __ ExpList
	| "return" __ ExpList _ ";"
 
_Block -> Statement
	| _Block _ ";" _ Statement
	| _Block __ Statement
 
Statement ->
	VarList _ "=" _ ExpList
	| FunctionCall
	| Label
	| "break"
	| "goto" __ Name
	| "do" __ Block __ "end"
	| "while" __ Exp __ "do" __ Block __ "end"
	| "repeat" __ Block __ "until" __ Exp
	| "if" __ Exp __ "then" __ Block __ Else
	| "for" __ NameList __ "in" __ ExpList __ "do" __ Block __ "end"
	| "function" __ FunctionName _ FunctionBody
	| "local" __ "function" __ Name __ FunctionBody
	| "local" __ NameList
	| "local" __ NameList _ "=" _ ExpList
 
Else -> "end"
	| _Else __ "end"
	| _Else __ "else" __ Block __ "end"
 
_Else ->       "elseif" __ Exp __ "then" __ Block
	| _Else __ "elseif" __ Exp __ "then" __ Block
 
Label -> "::" _ Name _ "::"
 
# Names
# See Section 2.1
Name -> _name {% function(d) {return {'name': d[0]}; } %}
 
_name -> [a-zA-Z_] {% id %}
	| _name [\w_] {% function(d) {return d[0] + d[1]; } %}
 
NameList -> Name
	| NameList _ "," _ Name
 
Var -> Name
	| PrefixExp _ "[" _ Exp _ "]"
	| PrefixExp _ "." _ Name
 
VarList -> Var
	| VarList _ "," _ Var
 
ExpList -> Exp
	| ExpList _ "," _ Exp
 
PrefixExp -> Var
	| FunctionCall
	| Parenthesized
 
FunctionCall ->
	PrefixExp _ Args
	| PrefixExp _ ":" _ Name _ Args
 
Args ->
	"(" _ ")"
	| "(" _ ExpList _ ")"
	| String
 
FunctionName -> _functionname
	| _functionname ":" Name
 
_functionname -> Name
	| FunctionName _ "." _ FunctionName
 
FunctionDef -> "function" __ FunctionBody
 
FunctionBody -> "(" _ ParamList _ ")" __ Block __ "end"
	| "(" _ ")" __ Block __ "end"
 
ParamList -> NameList
	| NameList _ "," _ "..."
	| "..."
 
# Tables
 
TableConstructor -> "{" _ FieldList _ "}"
	| "{" _ "}"
 
FieldList -> _FieldList
	| _FieldList _ FieldSep
 
_FieldList -> Field
	| _FieldList _ FieldSep _ Field
 
Field -> "[" _ Exp _ "]" _ "=" _ Exp | Name _ "=" _ Exp | Exp
 
FieldSep -> "," | ";"
 
# Expressions
Exp -> Binop		{% id %}
 
Binop -> ExpOr {% id %}
 
Parenthesized -> "(" Exp ")"
 
 
ExpOr -> ExpOr __ "or" __ ExpAnd
	| ExpAnd {% id %}
 
ExpAnd -> ExpAnd __ "and" __ ExpComparison
	| ExpComparison {% id %}
 
ExpComparison ->
	  ExpComparison _ "<"  _ ExpConcatenation
	| ExpComparison _ ">"  _ ExpConcatenation
	| ExpComparison _ "<=" _ ExpConcatenation
	| ExpComparison _ ">=" _ ExpConcatenation
	| ExpComparison _ "~=" _ ExpConcatenation
	| ExpComparison _ "==" _ ExpConcatenation
	| ExpConcatenation
 
ExpConcatenation ->
	  ExpSum _ ".." _ ExpConcatenation
	| ExpSum
 
ExpSum ->
	  ExpSum _ "+" _ ExpProduct
	| ExpSum _ "-" _ ExpProduct
	| ExpProduct
 
ExpProduct ->
	  ExpProduct _ "*" _ ExpUnary
	| ExpProduct _ "/" _ ExpUnary
	| ExpProduct _ "%" _ ExpUnary
	| ExpUnary
 
ExpUnary ->
	  "not" __ ExpPow
	| "#" _ ExpPow
	| "-" _ ExpPow
	| ExpPow
 
ExpPow ->
	  Atom
	| Atom _ "^" _ ExpPow
 
Atom -> Number | String | PrefixExp | "nil" | "false" | "true" | Parenthesized | FunctionDef | TableConstructor
 
 
 
 
 
# Primitives
# ==========
 
# Numbers
 
Number -> _number {% function(d) {return {'literal': parseFloat(d[0])}} %}
 
_posint ->
	[0-9] {% id %}
	| _posint [0-9] {% function(d) {return d[0] + d[1]} %}
 
_int ->
	"-" _posint {% function(d) {return d[0] + d[1]; }%}
	| _posint {% id %}
 
_float ->
	_int {% id %}
	| _int "." _posint {% function(d) {return d[0] + d[1] + d[2]; }%}
 
_number ->
	_float {% id %}
	| _float "e" _int {% function(d){return d[0] + d[1] + d[2]; } %}
 
 
#Strings
 
String -> "\"" _string "\"" {% function(d) {return {'literal':d[1]}; } %}
 
_string ->
	null {% function() {return ""; } %}
	| _string _stringchar {% function(d) {return d[0] + d[1];} %}
 
_stringchar ->
	[^\\"] {% id %}
	| "\\" [^] {% function(d) {return JSON.parse("\"" + d[0] + d[1] + "\""); } %}
 
# Whitespace
_ -> null | _ [\s] {% function() {} %}
__ -> [\s] | __ [\s] {% function() {} %}
