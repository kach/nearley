// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "Program", "symbols": ["_", "SourceElements", "_"]},
    {"name": "Program", "symbols": ["_"]},
    {"name": "SourceElements", "symbols": ["SourceElement"]},
    {"name": "SourceElements", "symbols": ["SourceElements", "_", "SourceElement"]},
    {"name": " string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "PrimaryExpression", "symbols": [" string$1"]},
    {"name": "PrimaryExpression", "symbols": ["ObjectLiteral"]},
    {"name": "PrimaryExpression", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}]},
    {"name": "PrimaryExpression", "symbols": ["Identifier"]},
    {"name": "PrimaryExpression", "symbols": ["ArrayLiteral"]},
    {"name": "PrimaryExpression", "symbols": ["Literal"]},
    {"name": "Literal", "symbols": ["Number"]},
    {"name": "Literal", "symbols": ["HexNumber"]},
    {"name": "Literal", "symbols": ["String"]},
    {"name": "Literal", "symbols": ["Null"]},
    {"name": "Literal", "symbols": ["Regex"]},
    {"name": " string$2", "symbols": [{"literal":"n"}, {"literal":"u"}, {"literal":"l"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Null", "symbols": [" string$2"]},
    {"name": "RegexInside", "symbols": [" ebnf$3"]},
    {"name": "Regex", "symbols": [{"literal":"/"}, " ebnf$4", {"literal":"/"}, " ebnf$5"]},
    {"name": " string$6", "symbols": [{"literal":"0"}, {"literal":"x"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "HexNumber", "symbols": [" string$6", " ebnf$7"]},
    {"name": "Number", "symbols": ["_number"]},
    {"name": "_posint", "symbols": [" ebnf$8"]},
    {"name": "_int", "symbols": [{"literal":"-"}, "_posint"]},
    {"name": "_int", "symbols": ["_posint"]},
    {"name": "_float", "symbols": ["_int"]},
    {"name": "_float", "symbols": ["_int", {"literal":"."}, "_posint"]},
    {"name": "_number", "symbols": ["_float"]},
    {"name": "_number", "symbols": ["_float", {"literal":"e"}, "_int"]},
    {"name": "String", "symbols": [{"literal":"\""}, "_stringdouble", {"literal":"\""}]},
    {"name": "String", "symbols": [{"literal":"'"}, "_stringsingle", {"literal":"'"}]},
    {"name": "_stringsingle", "symbols": []},
    {"name": "_stringsingle", "symbols": ["_stringsingle", "_stringsinglechar"]},
    {"name": "_stringsinglechar", "symbols": [/[^\\']/]},
    {"name": "_stringsinglechar", "symbols": [{"literal":"\\"}, /[^\n]/]},
    {"name": "_stringdouble", "symbols": []},
    {"name": "_stringdouble", "symbols": ["_stringdouble", "_stringdoublechar"]},
    {"name": "_stringdoublechar", "symbols": [/[^\\"]/]},
    {"name": "_stringdoublechar", "symbols": [{"literal":"\\"}, /[^\n]/]},
    {"name": "Identifier_Name", "symbols": [/[a-zA-Z_$]/]},
    {"name": "Identifier_Name", "symbols": ["Identifier_Name", /[a-zA-Z0-9_]/]},
    {"name": "Identifier", "symbols": ["Identifier_Name"]},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", {"literal":"]"}]},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "Elision", "_", {"literal":"]"}]},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ElementList", "_", "Elision", "_", {"literal":"]"}]},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ElementList", "_", {"literal":"]"}]},
    {"name": "ElementList", "symbols": [" ebnf$9", "_", "AssignmentExpression"]},
    {"name": "ElementList", "symbols": ["ElementList", "_", "Elision", "_", "AssignmentExpression"]},
    {"name": "Elision", "symbols": [{"literal":","}]},
    {"name": "Elision", "symbols": ["Elision", "_", {"literal":","}]},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", " ebnf$10", "_", {"literal":"}"}]},
    {"name": "PropertyNameAndValueList", "symbols": ["PropertyNameAndValue"]},
    {"name": "PropertyNameAndValueList", "symbols": ["PropertyNameAndValueList", "_", {"literal":","}, "_", "PropertyNameAndValue"]},
    {"name": "PropertyNameAndValueList", "symbols": ["PropertyNameAndValueList", "_", {"literal":","}]},
    {"name": "PropertyNameAndValue", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "PropertyName", "symbols": ["Identifier"]},
    {"name": "PropertyName", "symbols": ["String"]},
    {"name": "PropertyName", "symbols": ["Number"]},
    {"name": "MemberExpression", "symbols": ["AllocationExpression"]},
    {"name": "MemberExpression", "symbols": ["MemberExpressionForIn"]},
    {"name": "MemberExpressionForIn", "symbols": ["FunctionExpression"]},
    {"name": "MemberExpressionForIn", "symbols": ["PrimaryExpression"]},
    {"name": "MemberExpressionForIn", "symbols": ["MemberExpressionForIn", "_", "MemberExpressionPart"]},
    {"name": " string$11", "symbols": [{"literal":"n"}, {"literal":"e"}, {"literal":"w"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AllocationExpression", "symbols": [" string$11", "_", "MemberExpression"]},
    {"name": "AllocationExpressionPart", "symbols": ["Arguments"]},
    {"name": "AllocationExpressionPart", "symbols": ["AllocationExpressionPart", "_", "MemberExpressionPart"]},
    {"name": "MemberExpressionPart", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "MemberExpressionPart", "symbols": [{"literal":"."}, "_", "Identifier"]},
    {"name": "CallExpression", "symbols": ["MemberExpression", "_", "Arguments"]},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", "CallExpressionPart"]},
    {"name": "CallExpressionForIn", "symbols": ["MemberExpressionForIn", "_", "Arguments"]},
    {"name": "CallExpressionForIn", "symbols": ["CallExpressionForIn", "_", "CallExpressionPart"]},
    {"name": "CallExpressionPart", "symbols": ["Arguments"]},
    {"name": "CallExpressionPart", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "CallExpressionPart", "symbols": [{"literal":"."}, "_", "Identifier"]},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}]},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", "ArgumentList", "_", {"literal":")"}]},
    {"name": "ArgumentList", "symbols": ["AssignmentExpression"]},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", "AssignmentExpression"]},
    {"name": "LeftHandSideExpression", "symbols": ["CallExpression"]},
    {"name": "LeftHandSideExpression", "symbols": ["MemberExpression"]},
    {"name": "LeftHandSideExpressionForIn", "symbols": ["CallExpressionForIn"]},
    {"name": "LeftHandSideExpressionForIn", "symbols": ["MemberExpressionForIn"]},
    {"name": "PostfixExpression", "symbols": ["LeftHandSideExpression", "_", "PostfixOperator"]},
    {"name": "PostfixExpression", "symbols": ["LeftHandSideExpression"]},
    {"name": " string$12", "symbols": [{"literal":"+"}, {"literal":"+"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "PostfixOperator", "symbols": [" string$12"]},
    {"name": " string$13", "symbols": [{"literal":"-"}, {"literal":"-"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "PostfixOperator", "symbols": [" string$13"]},
    {"name": "UnaryExpression", "symbols": ["PostfixExpression"]},
    {"name": "UnaryExpression", "symbols": ["UnaryExpressionParts"]},
    {"name": "UnaryExpressionParts", "symbols": ["UnaryOperator", "_", "UnaryExpression"]},
    {"name": "UnaryExpressionParts", "symbols": ["UnaryExpressionParts", "_", "UnaryOperator", "_", "UnaryExpression"]},
    {"name": " string$14", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "UnaryOperator", "symbols": [" string$14"]},
    {"name": " string$15", "symbols": [{"literal":"v"}, {"literal":"o"}, {"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "UnaryOperator", "symbols": [" string$15"]},
    {"name": " string$16", "symbols": [{"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "UnaryOperator", "symbols": [" string$16"]},
    {"name": " string$17", "symbols": [{"literal":"+"}, {"literal":"+"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "UnaryOperator", "symbols": [" string$17"]},
    {"name": " string$18", "symbols": [{"literal":"-"}, {"literal":"-"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "UnaryOperator", "symbols": [" string$18"]},
    {"name": "UnaryOperator", "symbols": [{"literal":"+"}]},
    {"name": "UnaryOperator", "symbols": [{"literal":"-"}]},
    {"name": "UnaryOperator", "symbols": [{"literal":"~"}]},
    {"name": "UnaryOperator", "symbols": [{"literal":"!"}]},
    {"name": "MultiplicativeExpression", "symbols": ["UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", "MultiplicativeOperator", "_", "UnaryExpression"]},
    {"name": "MultiplicativeOperator", "symbols": [{"literal":"*"}]},
    {"name": "MultiplicativeOperator", "symbols": [{"literal":"/"}]},
    {"name": "MultiplicativeOperator", "symbols": [{"literal":"%"}]},
    {"name": "AdditiveExpression", "symbols": ["MultiplicativeExpression"]},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", "AdditiveOperator", "_", "MultiplicativeExpression"]},
    {"name": "AdditiveOperator", "symbols": [{"literal":"+"}]},
    {"name": "AdditiveOperator", "symbols": [{"literal":"-"}]},
    {"name": "ShiftExpression", "symbols": ["AdditiveExpression"]},
    {"name": "ShiftExpression", "symbols": ["ShiftExpression", "_", "ShiftOperator", "_", "AdditiveExpression"]},
    {"name": " string$19", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ShiftOperator", "symbols": [" string$19"]},
    {"name": " string$20", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ShiftOperator", "symbols": [" string$20"]},
    {"name": " string$21", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ShiftOperator", "symbols": [" string$21"]},
    {"name": "RelationalWordExpression", "symbols": ["ShiftExpression"]},
    {"name": "RelationalWordExpression", "symbols": ["RelationalWordExpression", "__", "RelationalWordOperator", "__", "ShiftExpression"]},
    {"name": " string$22", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}, {"literal":"c"}, {"literal":"e"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalWordOperator", "symbols": [" string$22"]},
    {"name": " string$23", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalWordOperator", "symbols": [" string$23"]},
    {"name": "RelationalExpression", "symbols": ["RelationalWordExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", "RelationalOperator", "_", "RelationalWordExpression"]},
    {"name": "RelationalOperator", "symbols": [{"literal":"<"}]},
    {"name": "RelationalOperator", "symbols": [{"literal":">"}]},
    {"name": " string$24", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalOperator", "symbols": [" string$24"]},
    {"name": " string$25", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalOperator", "symbols": [" string$25"]},
    {"name": "RelationalExpressionNoIn", "symbols": ["ShiftExpression"]},
    {"name": "RelationalExpressionNoIn", "symbols": ["RelationalExpressionNoIn", "_", "RelationalNoInOperator", "_", "ShiftExpression"]},
    {"name": "RelationalNoInOperator", "symbols": [{"literal":"<"}]},
    {"name": "RelationalNoInOperator", "symbols": [{"literal":">"}]},
    {"name": " string$26", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalNoInOperator", "symbols": [" string$26"]},
    {"name": " string$27", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalNoInOperator", "symbols": [" string$27"]},
    {"name": " string$28", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}, {"literal":"c"}, {"literal":"e"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "RelationalNoInOperator", "symbols": [" string$28"]},
    {"name": "EqualityExpression", "symbols": ["RelationalExpression"]},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", "EqualityOperator", "_", "RelationalExpression"]},
    {"name": "EqualityExpressionNoIn", "symbols": ["RelationalExpressionNoIn"]},
    {"name": "EqualityExpressionNoIn", "symbols": ["EqualityExpressionNoIn", "_", "EqualityOperator", "_", "RelationalExpressionNoIn"]},
    {"name": " string$29", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "EqualityOperator", "symbols": [" string$29"]},
    {"name": " string$30", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "EqualityOperator", "symbols": [" string$30"]},
    {"name": " string$31", "symbols": [{"literal":"="}, {"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "EqualityOperator", "symbols": [" string$31"]},
    {"name": " string$32", "symbols": [{"literal":"!"}, {"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "EqualityOperator", "symbols": [" string$32"]},
    {"name": "BitwiseANDExpression", "symbols": ["EqualityExpression"]},
    {"name": "BitwiseANDExpression", "symbols": ["BitwiseANDExpression", "_", "BitwiseANDOperator", "_", "EqualityExpression"]},
    {"name": "BitwiseANDExpressionNoIn", "symbols": ["EqualityExpressionNoIn"]},
    {"name": "BitwiseANDExpressionNoIn", "symbols": ["BitwiseANDExpressionNoIn", "_", "BitwiseANDOperator", "_", "EqualityExpressionNoIn"]},
    {"name": "BitwiseANDOperator", "symbols": [{"literal":"&"}]},
    {"name": "BitwiseXORExpression", "symbols": ["BitwiseANDExpression"]},
    {"name": "BitwiseXORExpression", "symbols": ["BitwiseXORExpression", "_", "BitwiseXOROperator", "_", "BitwiseANDExpression"]},
    {"name": "BitwiseXORExpressionNoIn", "symbols": ["BitwiseANDExpressionNoIn"]},
    {"name": "BitwiseXORExpressionNoIn", "symbols": ["BitwiseXORExpressionNoIn", "_", "BitwiseXOROperator", "_", "BitwiseANDExpressionNoIn"]},
    {"name": "BitwiseXOROperator", "symbols": [{"literal":"^"}]},
    {"name": "BitwiseORExpression", "symbols": ["BitwiseXORExpression"]},
    {"name": "BitwiseORExpression", "symbols": ["BitwiseORExpression", "_", "BitwiseOROperator", "_", "BitwiseXORExpression"]},
    {"name": "BitwiseORExpressionNoIn", "symbols": ["BitwiseXORExpressionNoIn"]},
    {"name": "BitwiseORExpressionNoIn", "symbols": ["BitwiseORExpressionNoIn", "_", "BitwiseOROperator", "_", "BitwiseXORExpressionNoIn"]},
    {"name": "BitwiseOROperator", "symbols": [{"literal":"|"}]},
    {"name": "LogicalANDExpression", "symbols": ["BitwiseORExpression"]},
    {"name": "LogicalANDExpression", "symbols": ["LogicalANDExpression", "_", "LogicalANDOperator", "_", "BitwiseORExpression"]},
    {"name": "LogicalANDExpressionNoIn", "symbols": ["BitwiseORExpressionNoIn"]},
    {"name": "LogicalANDExpressionNoIn", "symbols": ["LogicalANDExpressionNoIn", "_", "LogicalANDOperator", "_", "BitwiseORExpressionNoIn"]},
    {"name": " string$33", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "LogicalANDOperator", "symbols": [" string$33"]},
    {"name": "LogicalORExpression", "symbols": ["LogicalANDExpression"]},
    {"name": "LogicalORExpression", "symbols": ["LogicalORExpression", "_", "LogicalOROperator", "_", "LogicalANDExpression"]},
    {"name": "LogicalORExpressionNoIn", "symbols": ["LogicalANDExpressionNoIn"]},
    {"name": "LogicalORExpressionNoIn", "symbols": ["LogicalORExpressionNoIn", "_", "LogicalOROperator", "_", "LogicalANDExpressionNoIn"]},
    {"name": " string$34", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "LogicalOROperator", "symbols": [" string$34"]},
    {"name": "ConditionalExpression", "symbols": ["LogicalORExpression", "_", {"literal":"?"}, "_", "AssignmentExpression", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "ConditionalExpression", "symbols": ["LogicalORExpression"]},
    {"name": "ConditionalExpressionNoIn", "symbols": ["LogicalORExpressionNoIn", "_", {"literal":"?"}, "_", "AssignmentExpression", "_", {"literal":":"}, "_", "AssignmentExpressionNoIn"]},
    {"name": "ConditionalExpressionNoIn", "symbols": ["LogicalORExpressionNoIn"]},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentOperator", "_", "AssignmentExpression"]},
    {"name": "AssignmentExpression", "symbols": ["ConditionalExpression"]},
    {"name": "AssignmentExpressionNoIn", "symbols": ["LeftHandSideExpression", "_", "AssignmentOperator", "_", "AssignmentExpressionNoIn"]},
    {"name": "AssignmentExpressionNoIn", "symbols": ["ConditionalExpressionNoIn"]},
    {"name": "AssignmentOperator", "symbols": [{"literal":"="}]},
    {"name": " string$35", "symbols": [{"literal":"*"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$35"]},
    {"name": "AssignmentOperator", "symbols": [{"literal":"/"}]},
    {"name": " string$36", "symbols": [{"literal":"%"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$36"]},
    {"name": " string$37", "symbols": [{"literal":"+"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$37"]},
    {"name": " string$38", "symbols": [{"literal":"-"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$38"]},
    {"name": " string$39", "symbols": [{"literal":"<"}, {"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$39"]},
    {"name": " string$40", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$40"]},
    {"name": " string$41", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$41"]},
    {"name": " string$42", "symbols": [{"literal":"&"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$42"]},
    {"name": " string$43", "symbols": [{"literal":"^"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$43"]},
    {"name": " string$44", "symbols": [{"literal":"|"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "AssignmentOperator", "symbols": [" string$44"]},
    {"name": "Expression", "symbols": ["AssignmentExpression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":","}, "_", "AssignmentExpression"]},
    {"name": "ExpressionNoIn", "symbols": ["AssignmentExpressionNoIn"]},
    {"name": "ExpressionNoIn", "symbols": ["ExpressionNoIn", "_", {"literal":","}, "_", "AssignmentExpressionNoIn"]},
    {"name": "Statement", "symbols": ["Block"]},
    {"name": "Statement", "symbols": ["JScriptVarStatement"]},
    {"name": "Statement", "symbols": ["VariableStatement"]},
    {"name": "Statement", "symbols": ["EmptyStatement"]},
    {"name": "Statement", "symbols": ["LabelledStatement"]},
    {"name": "Statement", "symbols": ["ExpressionStatement"]},
    {"name": "Statement", "symbols": ["IfStatement"]},
    {"name": "Statement", "symbols": ["IterationStatement"]},
    {"name": "Statement", "symbols": ["ContinueStatement"]},
    {"name": "Statement", "symbols": ["BreakStatement"]},
    {"name": "Statement", "symbols": ["ImportStatement"]},
    {"name": "Statement", "symbols": ["ReturnStatement"]},
    {"name": "Statement", "symbols": ["WithStatement"]},
    {"name": "Statement", "symbols": ["SwitchStatement"]},
    {"name": "Statement", "symbols": ["ThrowStatement"]},
    {"name": "Statement", "symbols": ["TryStatement"]},
    {"name": "Block", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "Block", "symbols": [{"literal":"{"}, "_", "BlockList", "_", {"literal":"}"}]},
    {"name": "BlockList", "symbols": ["Expression"]},
    {"name": "BlockList", "symbols": ["StatementList"]},
    {"name": "BlockList", "symbols": ["StatementList", "Expression"]},
    {"name": "StatementList", "symbols": ["Statement"]},
    {"name": "StatementList", "symbols": ["StatementList", "_", "Statement"]},
    {"name": " string$45", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "VariableStatement", "symbols": [" string$45", "_", "VariableDeclarationList", "_", {"literal":";"}]},
    {"name": " string$46", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "VariableStatement", "symbols": [" string$46", "_", "VariableDeclarationList", "newline"]},
    {"name": "VariableDeclarationList", "symbols": ["VariableDeclaration"]},
    {"name": "VariableDeclarationList", "symbols": ["VariableDeclarationList", "_", {"literal":","}, "_", "VariableDeclaration"]},
    {"name": "VariableDeclarationListNoIn", "symbols": ["VariableDeclarationNoIn"]},
    {"name": "VariableDeclarationListNoIn", "symbols": ["VariableDeclarationListNoIn", "_", {"literal":","}, "_", "VariableDeclarationNoIn"]},
    {"name": "VariableDeclaration", "symbols": ["Identifier", "_", "Initialiser"]},
    {"name": "VariableDeclaration", "symbols": ["Identifier"]},
    {"name": "VariableDeclarationNoIn", "symbols": ["Identifier", "_", "InitialiserNoIn"]},
    {"name": "VariableDeclarationNoIn", "symbols": ["Identifier"]},
    {"name": "Initialiser", "symbols": [{"literal":"="}, "_", "AssignmentExpression"]},
    {"name": "InitialiserNoIn", "symbols": [{"literal":"="}, "_", "AssignmentExpressionNoIn"]},
    {"name": "EmptyStatement", "symbols": [{"literal":";"}]},
    {"name": "ExpressionStatement", "symbols": ["Expression", "_", {"literal":";"}]},
    {"name": "ExpressionStatement", "symbols": ["Expression", "newline"]},
    {"name": " string$47", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$48", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IfStatement", "symbols": [" string$47", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Statement", "_", " string$48", "_", "Statement"]},
    {"name": " string$49", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IfStatement", "symbols": [" string$49", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$50", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$51", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$50", "_", "Statement", "_", " string$51", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": " string$52", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$53", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$52", "_", "Statement", "_", " string$53", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "newline"]},
    {"name": " string$54", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$54", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$55", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$56", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$55", "_", {"literal":"("}, "_", " string$56", "_", "VariableDeclarationList", "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$57", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$58", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$57", "_", {"literal":"("}, "_", " string$58", "_", "VariableDeclarationList", "_", {"literal":";"}, "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$59", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$60", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$59", "_", {"literal":"("}, "_", " string$60", "_", "VariableDeclarationList", "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$61", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$62", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$61", "_", {"literal":"("}, "_", " string$62", "_", "VariableDeclarationList", "_", {"literal":";"}, "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$63", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$63", "_", {"literal":"("}, "_", "ExpressionNoIn", "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$64", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$64", "_", {"literal":"("}, "_", "ExpressionNoIn", "_", {"literal":";"}, "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$65", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$65", "_", {"literal":"("}, "_", "ExpressionNoIn", "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$66", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$66", "_", {"literal":"("}, "_", "ExpressionNoIn", "_", {"literal":";"}, "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$67", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$67", "_", {"literal":"("}, "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$68", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$68", "_", {"literal":"("}, "_", {"literal":";"}, "_", {"literal":";"}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$69", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$69", "_", {"literal":"("}, "_", {"literal":";"}, "_", "Expression", "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$70", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$71", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$70", "_", {"literal":"("}, "_", "Expression", "_", " string$71", "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$72", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$72", "_", {"literal":"("}, "_", {"literal":";"}, "_", {"literal":";"}, "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$73", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$74", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$75", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$73", "_", {"literal":"("}, "_", " string$74", "_", "VariableDeclarationNoIn", "_", " string$75", "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$76", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$77", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "IterationStatement", "symbols": [" string$76", "_", {"literal":"("}, "_", "LeftHandSideExpressionForIn", "_", " string$77", "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$78", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ContinueStatement", "symbols": [" string$78", "_", "Identifier", "_", {"literal":";"}]},
    {"name": " string$79", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ContinueStatement", "symbols": [" string$79", "_", "Identifier", "_", "newline"]},
    {"name": " string$80", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ContinueStatement", "symbols": [" string$80", "_", {"literal":";"}]},
    {"name": " string$81", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "BreakStatement", "symbols": [" string$81", "_", "Identifier", "_", {"literal":";"}]},
    {"name": " string$82", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "BreakStatement", "symbols": [" string$82", "_", "Identifier", "_", "newline"]},
    {"name": " string$83", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "BreakStatement", "symbols": [" string$83", "_", {"literal":";"}]},
    {"name": " string$84", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStatement", "symbols": [" string$84", "_", "Expression", "_", {"literal":";"}]},
    {"name": " string$85", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStatement", "symbols": [" string$85", "_", "Expression", "_", "newline"]},
    {"name": " string$86", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStatement", "symbols": [" string$86", "_", {"literal":";"}]},
    {"name": " string$87", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStatement", "symbols": [" string$87", "_", "newline"]},
    {"name": " string$88", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "WithStatement", "symbols": [" string$88", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Statement"]},
    {"name": " string$89", "symbols": [{"literal":"s"}, {"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"c"}, {"literal":"h"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "SwitchStatement", "symbols": [" string$89", "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "CaseBlock"]},
    {"name": "CaseBlock", "symbols": [{"literal":"{"}, "_", "CaseClauses?", "_", {"literal":"}"}]},
    {"name": "CaseBlock", "symbols": [{"literal":"{"}, "_", "CaseClauses?", "_", "DefaultClause", "_", "CaseClauses?", "_", {"literal":"}"}]},
    {"name": "CaseClauses", "symbols": ["CaseClause"]},
    {"name": "CaseClauses", "symbols": ["CaseClauses", "_", "CaseClause"]},
    {"name": "CaseClauses?", "symbols": ["CaseClauses"]},
    {"name": "CaseClauses?", "symbols": []},
    {"name": " string$90", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "CaseClause", "symbols": [" string$90", "_", "Expression", "_", {"literal":":"}, "_", "StatementList"]},
    {"name": " string$91", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "CaseClause", "symbols": [" string$91", "_", "Expression", "_", {"literal":":"}]},
    {"name": " string$92", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"a"}, {"literal":"u"}, {"literal":"l"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "DefaultClause", "symbols": [" string$92", "_", {"literal":":"}, "_", "StatementList"]},
    {"name": " string$93", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"f"}, {"literal":"a"}, {"literal":"u"}, {"literal":"l"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "DefaultClause", "symbols": [" string$93", "_", {"literal":":"}]},
    {"name": "LabelledStatement", "symbols": ["Identifier", "_", {"literal":":"}, "_", "Statement"]},
    {"name": " string$94", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"r"}, {"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ThrowStatement", "symbols": [" string$94", "_", "Expression", "_", {"literal":";"}]},
    {"name": " string$95", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"r"}, {"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ThrowStatement", "symbols": [" string$95", "_", "Expression", "_", "newline"]},
    {"name": " string$96", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "TryStatement", "symbols": [" string$96", "_", "Block", "_", "Finally"]},
    {"name": " string$97", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "TryStatement", "symbols": [" string$97", "_", "Block", "_", "Catch", "_", "Finally"]},
    {"name": " string$98", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "TryStatement", "symbols": [" string$98", "_", "Block", "_", "Catch", "_", "Finally"]},
    {"name": " string$99", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"t"}, {"literal":"c"}, {"literal":"h"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Catch", "symbols": [" string$99", "_", {"literal":"("}, "_", "Identifier", "_", {"literal":")"}, "_", "Block"]},
    {"name": " string$100", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"l"}, {"literal":"l"}, {"literal":"y"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Finally", "symbols": [" string$100", "_", "Block"]},
    {"name": " string$101", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionExpression", "symbols": [" string$101", "__", "Identifier", "_", {"literal":"("}, "_", "FormalParameterList?", "_", {"literal":")"}, "_", "FunctionBody"]},
    {"name": " string$102", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionExpression", "symbols": [" string$102", "_", {"literal":"("}, "_", "FormalParameterList?", "_", {"literal":")"}, "_", "FunctionBody"]},
    {"name": "FormalParameterList?", "symbols": ["FormalParameterList"]},
    {"name": "FormalParameterList?", "symbols": []},
    {"name": "FormalParameterList", "symbols": ["Identifier"]},
    {"name": "FormalParameterList", "symbols": ["FormalParameterList", "_", {"literal":","}, "_", "Identifier"]},
    {"name": "FunctionBody", "symbols": [{"literal":"{"}, "_", "SourceElements", "_", {"literal":"}"}]},
    {"name": "FunctionBody", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "SourceElement", "symbols": ["Statement"]},
    {"name": " string$103", "symbols": [{"literal":"i"}, {"literal":"m"}, {"literal":"p"}, {"literal":"o"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ImportStatement", "symbols": [" string$103", "__", "Name", "_", {"literal":"."}, "_", {"literal":"*"}, "_", {"literal":";"}]},
    {"name": " string$104", "symbols": [{"literal":"i"}, {"literal":"m"}, {"literal":"p"}, {"literal":"o"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ImportStatement", "symbols": [" string$104", "__", "Name", "_", {"literal":";"}]},
    {"name": "Name", "symbols": ["Identifier_Name"]},
    {"name": "Name", "symbols": ["Name", "_", {"literal":"."}, "_", "Identifier_Name"]},
    {"name": " string$105", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "JScriptVarStatement", "symbols": [" string$105", "__", "JScriptVarDeclarationList", "_", {"literal":";"}]},
    {"name": " string$106", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "JScriptVarStatement", "symbols": [" string$106", "__", "JScriptVarDeclarationList", "_", "newline"]},
    {"name": "JScriptVarDeclarationList", "symbols": ["JScriptVarDeclaration"]},
    {"name": "JScriptVarDeclarationList", "symbols": ["JScriptVarDeclarationList", "_", {"literal":","}, "_", "JScriptVarDeclaration"]},
    {"name": "JScriptVarDeclaration", "symbols": ["Identifier", "_", {"literal":":"}, "_", "Identifier_Name", "_", "Initialiser"]},
    {"name": "JScriptVarDeclaration", "symbols": ["Identifier", "_", {"literal":":"}, "_", "Identifier_Name"]},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["__"]},
    {"name": "__", "symbols": [/[\f\r\t\v\u00A0\u2028\u2029 ]/]},
    {"name": "__", "symbols": ["newline"]},
    {"name": "__", "symbols": [/[\f\r\t\v\u00A0\u2028\u2029 ]/, "__"]},
    {"name": "__", "symbols": ["newline", "__"]},
    {"name": "newline", "symbols": [" ebnf$107", {"literal":"\n"}]},
    {"name": " string$108", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "comment", "symbols": [" string$108", " ebnf$109"]},
    {"name": " string$110", "symbols": [{"literal":"/"}, {"literal":"*"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$113", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "comment", "symbols": [" string$110", " ebnf$111", " ebnf$112", " string$113"]},
    {"name": "commentchars", "symbols": [{"literal":"*"}, /[^/]/]},
    {"name": "commentchars", "symbols": [/[^*]/, /./]},
    {"name": " ebnf$3", "symbols": [/[^/\n]/]},
    {"name": " ebnf$3", "symbols": [/[^/\n]/, " ebnf$3"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$4", "symbols": ["RegexInside"], "postprocess": id},
    {"name": " ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": " ebnf$5", "symbols": [/[gim]/]},
    {"name": " ebnf$5", "symbols": [/[gim]/, " ebnf$5"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$7", "symbols": [/[a-f0-9A-F]/]},
    {"name": " ebnf$7", "symbols": [/[a-f0-9A-F]/, " ebnf$7"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$8", "symbols": [/[0-9]/]},
    {"name": " ebnf$8", "symbols": [/[0-9]/, " ebnf$8"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$9", "symbols": ["Elision"], "postprocess": id},
    {"name": " ebnf$9", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": " ebnf$10", "symbols": ["PropertyNameAndValueList"], "postprocess": id},
    {"name": " ebnf$10", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": " ebnf$107", "symbols": ["comment"], "postprocess": id},
    {"name": " ebnf$107", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": " ebnf$109", "symbols": []},
    {"name": " ebnf$109", "symbols": [/[^\n]/, " ebnf$109"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$111", "symbols": ["commentchars"]},
    {"name": " ebnf$111", "symbols": ["commentchars", " ebnf$111"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$112", "symbols": [/./], "postprocess": id},
    {"name": " ebnf$112", "symbols": [], "postprocess": function(d) {return null;}}
]
  , ParserStart: "Program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
