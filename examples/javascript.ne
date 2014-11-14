Program -> _ SourceElements _
#{% function(d){function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);}return flatten(d).join("");} %}
       | _
#{% function() {return '';} %}

#need better here
SourceElements  -> SourceElement
    | SourceElements _ SourceElement

PrimaryExpression   ->  "this" 
    | ObjectLiteral 
    | "("  _ Expression  _ ")"  
    | Identifier 
    | ArrayLiteral 
    | Literal 

Literal -> Number | HexNumber | String | Null | Regex 

# Primitives
# ==========

Null -> "null" 
RegexInside -> ([^/\n]|"[" [^\]]:* "/" [^\]]:* "]"):*
                

#Regex -> Regex [gim] 
#        #In reality it might only be one of each flag, no repeats allowed
#        | "/" RegexInside "/" 
#        | "//" 

Regex -> "/" RegexInside "/" [gim]:*

HexNumber ->    "0x" [a-f0-9A-F]:+
    
Number -> _number 
 
_posint ->  [0-9]:+
 
_int ->     "-" _posint 
    | _posint 
 
_float ->   _int 
    | _int   "." _posint
 
_number ->  _float 
    | _float   "e"   _int 
 
#Strings
 
String -> "\"" _stringdouble "\"" 
        | "'" _stringsingle "'" 
_stringsingle -> null 
    | _stringsingle _stringsinglechar 

_stringsinglechar -> [^\\'] 
    | "\\"  [^\n] 
_stringdouble -> null 
    | _stringdouble _stringdoublechar 

_stringdoublechar -> [^\\"] 
    | "\\"  [^\n] 

Identifier_Name -> [a-zA-Z_$] [a-zA-Z0-9_$]:*
# a bit jury rigged.... 
Identifier  ->  Identifier_Name 
ArrayLiteral    ->  "["  _ "]" 
                | "["   _ Elision  _ "]" 
                | "["  _ ElementList  _ Elision  _ "]" 
                | "["  _ ElementList  _ "]"
ElementList     ->  (Elision  _):? AssignmentExpression 
                | ElementList  _ Elision  _ AssignmentExpression  
Elision     ->  "," 
            | Elision  _ "," 

ObjectLiteral   ->  "{"  _ PropertyNameAndValueList:?  _ "}" 
PropertyNameAndValueList    ->  PropertyNameAndValue 
                            | PropertyNameAndValueList   _ ","  _ PropertyNameAndValue  
                            | PropertyNameAndValueList   _ "," 
PropertyNameAndValue    ->  PropertyName  _ ":"  _ AssignmentExpression 
PropertyName    ->  Identifier 
    |   String 
    |   Number 
MemberExpression    ->  AllocationExpression 
                    | MemberExpressionForIn 
MemberExpressionForIn ->FunctionExpression  
                    | PrimaryExpression  
                    | MemberExpressionForIn  _ MemberExpressionPart 
AllocationExpression    ->  "new"  _ MemberExpression    
                        #| AllocationExpression  _ AllocationExpressionPart 
                        # I had to comment out above line... I think everything still works
#I added this bit to make it work
AllocationExpressionPart  -> Arguments 
                            | AllocationExpressionPart   _ MemberExpressionPart 
                    
                    
MemberExpressionPart    ->  "["  _ Expression  _ "]" 
    |   "."  _ Identifier  
CallExpression  ->  MemberExpression  _ Arguments  
                | CallExpression  _ CallExpressionPart 
CallExpressionForIn     ->  MemberExpressionForIn  _ Arguments 
                    | CallExpressionForIn  _ CallExpressionPart 
CallExpressionPart  ->  Arguments 
    |   "["  _ Expression  _ "]"  
    |   "."  _ Identifier  
#hmmm spaces may matter here
Arguments   -> "("  _ ")"    
            | "("  _ ArgumentList  _ ")" 
ArgumentList    ->  AssignmentExpression  
                | ArgumentList  _ ","  _ AssignmentExpression 
LeftHandSideExpression  ->  CallExpression 
    |   MemberExpression 
LeftHandSideExpressionForIn     ->  CallExpressionForIn 
    |   MemberExpressionForIn 
PostfixExpression   ->  LeftHandSideExpression  _ PostfixOperator 
                    | LeftHandSideExpression 
PostfixOperator     ->   "++" | "--"  
UnaryExpression     ->  PostfixExpression  
                    | UnaryExpressionParts 
UnaryExpressionParts-> UnaryOperator  _ UnaryExpression   
                    | UnaryExpressionParts  _ UnaryOperator  _ UnaryExpression 
#I don't know exectly why this was needed...
#maybe for in that for loops stuff.....
#might need to add something to account for the lack of this later

UnaryOperator   ->  "delete" | "void" | "typeof" | "++" | "--" | "+" | "-" | "~" | "!" 
MultiplicativeExpression    ->  UnaryExpression  
                            | MultiplicativeExpression  _ MultiplicativeOperator  _ UnaryExpression 
MultiplicativeOperator  ->   "*" | "/" | "%"
AdditiveExpression  ->  MultiplicativeExpression  
                    | AdditiveExpression  _ AdditiveOperator  _ MultiplicativeExpression  
AdditiveOperator    ->   "+" | "-" 
ShiftExpression     ->  AdditiveExpression  
                    | ShiftExpression  _ ShiftOperator  _ AdditiveExpression  
ShiftOperator   ->  "<<" | ">>" | ">>>" 
RelationalWordExpression    ->  ShiftExpression  
                        | RelationalWordExpression  __ RelationalWordOperator  __ ShiftExpression  
RelationalWordOperator  ->  "instanceof" | "in" 
RelationalExpression    ->  RelationalWordExpression  
                        | RelationalExpression  _ RelationalOperator  _ RelationalWordExpression  
RelationalOperator  ->  "<" | ">" | "<=" | ">=" 
RelationalExpressionNoIn    ->  ShiftExpression  
                            | RelationalExpressionNoIn  _ RelationalNoInOperator  _ ShiftExpression  
RelationalNoInOperator  ->  "<" | ">" | "<=" | ">=" | "instanceof" 
EqualityExpression  ->  RelationalExpression  
                    | EqualityExpression  _ EqualityOperator  _ RelationalExpression 
EqualityExpressionNoIn  ->  RelationalExpressionNoIn  
                        | EqualityExpressionNoIn  _ EqualityOperator  _ RelationalExpressionNoIn  
EqualityOperator    ->  "==" | "!=" | "===" | "!==" 
BitwiseANDExpression    ->  EqualityExpression  
                        | BitwiseANDExpression  _ BitwiseANDOperator  _ EqualityExpression  
BitwiseANDExpressionNoIn    ->  EqualityExpressionNoIn  
                            | BitwiseANDExpressionNoIn  _ BitwiseANDOperator  _ EqualityExpressionNoIn  
BitwiseANDOperator  ->  "&" 
BitwiseXORExpression    ->  BitwiseANDExpression  
                        | BitwiseXORExpression  _ BitwiseXOROperator  _ BitwiseANDExpression  
BitwiseXORExpressionNoIn    ->  BitwiseANDExpressionNoIn  
                            | BitwiseXORExpressionNoIn  _ BitwiseXOROperator  _ BitwiseANDExpressionNoIn  
BitwiseXOROperator  ->  "^" 
BitwiseORExpression     ->  BitwiseXORExpression  
                        | BitwiseORExpression  _ BitwiseOROperator  _ BitwiseXORExpression  
BitwiseORExpressionNoIn     ->  BitwiseXORExpressionNoIn  
                            | BitwiseORExpressionNoIn  _ BitwiseOROperator  _ BitwiseXORExpressionNoIn 
BitwiseOROperator   ->  "|" 
LogicalANDExpression    ->  BitwiseORExpression  
                        | LogicalANDExpression  _ LogicalANDOperator  _ BitwiseORExpression  
LogicalANDExpressionNoIn    ->  BitwiseORExpressionNoIn  
                            | LogicalANDExpressionNoIn  _ LogicalANDOperator  _ BitwiseORExpressionNoIn 
LogicalANDOperator  ->  "&&" 
LogicalORExpression     ->  LogicalANDExpression  
                        | LogicalORExpression  _ LogicalOROperator  _ LogicalANDExpression 
LogicalORExpressionNoIn     ->  LogicalANDExpressionNoIn  
                            | LogicalORExpressionNoIn  _ LogicalOROperator  _ LogicalANDExpressionNoIn 
LogicalOROperator   ->  "||" 
ConditionalExpression   ->  LogicalORExpression  _ "?"  _ AssignmentExpression  _ ":"  _ AssignmentExpression  
                        | LogicalORExpression  
ConditionalExpressionNoIn   ->  LogicalORExpressionNoIn  _ "?"  _ AssignmentExpression  _ ":"  _ AssignmentExpressionNoIn  
                            | LogicalORExpressionNoIn 
AssignmentExpression    ->  LeftHandSideExpression  _ AssignmentOperator  _ AssignmentExpression | ConditionalExpression  
AssignmentExpressionNoIn    ->  LeftHandSideExpression  _ AssignmentOperator  _ AssignmentExpressionNoIn | ConditionalExpressionNoIn  
AssignmentOperator  ->   "=" | "*=" | "/" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=" 
Expression  ->  AssignmentExpression  
            | Expression  _ ","  _ AssignmentExpression  
ExpressionNoIn  ->  AssignmentExpressionNoIn  
                | ExpressionNoIn  _ ","  _ AssignmentExpressionNoIn  
Statement   ->  Block 
    |   JScriptVarStatement 
    |   VariableStatement 
    |   EmptyStatement 
    |   LabelledStatement 
    |   ExpressionStatement 
    |   IfStatement 
    |   IterationStatement 
    |   ContinueStatement 
    |   BreakStatement 
    |   ImportStatement 
    |   ReturnStatement 
    |   WithStatement 
    |   SwitchStatement 
    |   ThrowStatement 
    |   TryStatement 

Block   ->  "{"   _ (BlockList   _):? "}" 
        #is this a proper statement?
BlockList  -> ReturnEnd
            | StatementList (_ ReturnEnd):?
            #no ending with a expression, does this even matter?
            
            #should space be mandatory?
StatementList   ->  Statement  
                | StatementList  _ Statement 
VariableStatement   ->  "var"  _ VariableDeclarationList  _ ";"  
                    | "var"  _ VariableDeclarationList newline 
VariableDeclarationList     ->  VariableDeclaration  
                            | VariableDeclarationList  _ ","  _ VariableDeclaration 
VariableDeclarationListNoIn     ->  VariableDeclarationNoIn  
                                | VariableDeclarationListNoIn  _ ","  _ VariableDeclarationNoIn 
VariableDeclaration     ->  Identifier   _ Initialiser  
                        | Identifier 
VariableDeclarationNoIn     ->  Identifier  _ InitialiserNoIn 
                            | Identifier 
Initialiser     ->  "="  _ AssignmentExpression 
InitialiserNoIn     ->  "="  _ AssignmentExpressionNoIn 
EmptyStatement  ->  ";" 
                    #empty statement as newline causes probs
ExpressionStatement     ->  Expression  _ ";"  
                        | Expression newline 
IfStatement     ->  "if"  _ "("  _ Expression  _ ")"  _ Statement  _ "else"  _ Statement 
                | "if"  _ "("  _ Expression  _ ")"  _ Statement 
#should be redone with nulls
IterationStatement  ->   "do"  _ Statement  _ "while"  _ "("  _ Expression  _ ")"  _ ";"  
                    |  "do"  _ Statement  _ "while"  _ "("  _ Expression  _ ")" _ newline 
                    |    "while"  _ "("  _ Expression  _ ")"  _ Statement 
                    |   "for"  _ "("  _ "var"  _ VariableDeclarationList  _ ";"  _ Expression   _ ";"  _ Expression  _ ")"  _ Statement  
                    | "for"  _ "("  _ "var"  _ VariableDeclarationList  _ ";"  _ ";"  _ Expression   _ ")"  _ Statement  
                    | "for"  _ "("  _ "var"  _ VariableDeclarationList  _ ";"  _ Expression  _ ";"  _ ")"  _ Statement  
                    | "for"  _ "("  _ "var"  _ VariableDeclarationList  _ ";"  _ ";"  _ ")"  _ Statement  
                    |"for"  _ "("  _ ExpressionNoIn  _ ";"  _ Expression   _ ";"  _ Expression  _ ")"  _ Statement  
                    | "for"  _ "("  _ ExpressionNoIn  _ ";"  _ ";"  _ Expression   _ ")"  _ Statement  
                    | "for"  _ "("  _ ExpressionNoIn  _ ";"  _ Expression  _ ";"  _ ")"  _ Statement  
                    | "for"  _ "("  _ ExpressionNoIn  _ ";"  _ ";"  _ ")"  _ Statement  
                    |"for"  _ "("  _ ";"  _ Expression   _ ";"  _ Expression  _ ")"  _ Statement  
                    | "for"  _ "("   _ ";"  _ ";"  _ Expression   _ ")"  _ Statement  
                    | "for"  _ "("   _ ";"  _ Expression  _ ";"  _ ")"  _ Statement  
                    | "for"  _ "("  _ Expression _ "in" _ Expression _ ")"  _ Statement  
                    | "for"  _ "("   _ ";"  _ ";"  _ ")"  _ Statement  
                    |   "for"  _ "("  _ "var"  _ VariableDeclarationNoIn  _ "in"  _ Expression  _ ")"  _ Statement  
                    | "for"  _ "("  _ LeftHandSideExpressionForIn  _ "in"  _ Expression  _ ")"  _ Statement  
ContinueStatement   ->  "continue"  _ Identifier   _ ";"  
                    |   "continue"  _ Identifier _ newline 
                    |   "continue"   _ ";" 
BreakStatement  ->  "break"  _ Identifier   _ ";"  
                    |   "break"  _ Identifier _ newline 
                    |   "break"   _ ";" 
                    #identifier or Expression
ReturnStatement     ->  "return"  _ Expression   _ (";"|newline)
ReturnEnd -> "return"  (_ Expression):? 
WithStatement   ->  "with"  _ "("  _ Expression  _ ")"  _ Statement 
SwitchStatement     ->  "switch"  _ "("  _ Expression  _ ")"  _ CaseBlock 

CaseBlock   ->  "{"  _ CaseClauses?   _ "}"  
            | "{"  _ CaseClauses?    _ DefaultClause  _ CaseClauses?  _ "}" 
CaseClauses     ->  CaseClause  
                | CaseClauses  _ CaseClause 
CaseClauses? -> CaseClauses| null 
CaseClause  ->  "case"  _ Expression  _ ":"  _ StatementList  
            | "case"  _ Expression  _ ":" 
DefaultClause   ->   "default"  _ ":"   _ StatementList 
                | "default"  _ ":" 
LabelledStatement   ->  Identifier  _ ":"  _ Statement 
ThrowStatement  ->  "throw"  _ Expression  _ ";" 
                | "throw"  _ Expression  _ newline 
                #__ needed?, lets say not...
TryStatement    ->  "try"  _ Block  _ Finally  
                | "try"  _ Block  _ Catch  _ Finally 
                | "try"  _ Block  _ Catch  _ Finally 
Catch   ->  "catch"  _ "("  _ Identifier  _ ")"  _ Block 
Finally     ->  "finally"  _ Block 
#there used to be a seperate thing for function decleration
FunctionExpression  ->  "function"  __ Identifier  _ "("  _ (FormalParameterList  _):? ")"   _ Block
                    | "function"   _ "("  _ (FormalParameterList  _):? ")"   _ Block
FormalParameterList     ->  Identifier  
                        | FormalParameterList  _ ","  _ Identifier 
#Program    ->  ( SourceElements )? <EOF> 
#Program    ->  Program SourceElement 
#             |SourceElement 
#            | null 
SourceElement   ->  Statement  
ImportStatement     ->  "import"  __ Name  _ "."  _ "*"   _ ";" 
                    |   "import"  __ Name    _ ";" 
                    #no _ newline ?
Name    ->  Identifier_Name  
        | Name  _ "."  _ Identifier_Name  
JScriptVarStatement     ->  "var"  __ JScriptVarDeclarationList  _ ";" 
                        | "var"  __ JScriptVarDeclarationList _ newline 
                        #is this unambigous?
JScriptVarDeclarationList   ->  JScriptVarDeclaration  
                            | JScriptVarDeclarationList  _ ","  _ JScriptVarDeclaration  
JScriptVarDeclaration   ->  Identifier  _ ":"  _ Identifier_Name  _ Initialiser 
                        | Identifier  _ ":"  _ Identifier_Name  
#insertSemiColon    ->  java code 





#Whitespace
_ -> null   
    | __ 
__ -> [\f\r\t\v\u00A0\u2028\u2029 ]
    | newline 
    | [\f\r\t\v\u00A0\u2028\u2029 ] __ 
    | newline __ 

newline -> comment:? "\n" 
comment -> "//" [^\n]:* 
        | "/*" commentchars:+ .:? "*/" 
        
commentchars -> "*" [^/] 
            | [^*] .


#Based off of http://tomcopeland.blogs.com/EcmaScript.html (heavy modifications were done, thats just the general framework)
