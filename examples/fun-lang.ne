@{%
const moo = require("moo");

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    lte: "<=",
    lt: "<",
    gte: ">=",
    gt: ">",
    eq: "==",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "/",
    modulo: "%",
    colon: ":",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: {
        match: /[a-z_][a-z_0-9]*/,
        type: moo.keywords({
            fun: "fun",
            proc: "proc",
            while: "while",
            for: "for",
            else: "else",
            in: "in",
            if: "if",
            return: "return",
            and: "and",
            or: "or",
            true: "true",
            false: "false"
        })
    }
});


function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1
    };
}

function convertToken(token) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}

function convertTokenId(data) {
    return convertToken(data[0]);
}

%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements
    ->  top_level_statement
        {%
            d => [d[0]]
        %}
    |  top_level_statement _ "\n" _ top_level_statements
        {%
            d => [
                d[0],
                ...d[4]
            ]
        %}
    # below 2 sub-rules handle blank lines
    |  _ "\n" top_level_statements
        {%
            d => d[2]
        %}
    |  _
        {%
            d => []
        %}

top_level_statement
    -> fun_definition   {% id %}
    |  proc_definition  {% id %}
    |  line_comment     {% id %}

fun_definition
    -> "fun" __ identifier _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "fun_definition",
                name: d[2],
                parameters: d[6],
                body: d[10],
                start: tokenStart(d[0]),
                end: d[10].end
            })
        %}

proc_definition
    -> "proc" __ identifier _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "proc_definition",
                name: d[2],
                parameters: d[6],
                body: d[10],
                start: tokenStart(d[0]),
                end: d[10].end
            })
        %}

parameter_list
    -> null        {% () => [] %}
    | identifier   {% d => [d[0]] %}
    | identifier _ "," _ parameter_list
        {%
            d => [d[0], ...d[4]]
        %}

code_block -> "[" executable_statements "]"
    {%
        (d) => ({
            type: "code_block",
            statements: d[1],
            start: tokenStart(d[0]),
            end: tokenEnd(d[2])
        })
    %}

executable_statements
    -> _
        {% () => [] %}
    |  _ "\n" executable_statements
        {% (d) => d[2] %}
    |  _ executable_statement _
        {% d => [d[1]] %}
    |  _ executable_statement _ "\n" executable_statements
        {%
            d => [d[1], ...d[4]]
        %}

executable_statement
   -> return_statement     {% id %}
   |  var_assignment       {% id %}
   |  call_statement       {% id %}
   |  line_comment         {% id %}
   |  indexed_assignment   {% id %}
   |  while_loop           {% id %}
   |  if_statement         {% id %}
   |  for_loop             {% id %}

return_statement
   -> "return" __ expression
       {%
           d => ({
               type: "return_statement",
               value: d[2],
               start: tokenStart(d[0]),
               end: d[2].end
           })
       %}

var_assignment
    -> identifier _ "=" _ expression
        {%
            d => ({
                type: "var_assignment",
                var_name: d[0],
                value: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

call_statement -> call_expression  {% id %}

call_expression
    -> identifier _ "(" argument_list ")"
        {%
            d => ({
                type: "call_expression",
                fun_name: d[0],
                arguments: d[3],
                start: d[0].start,
                end: tokenEnd(d[4])
            })
        %}

indexed_access
    -> unary_expression _ "[" _ expression _ "]"
        {%
            d => ({
                type: "indexed_access",
                subject: d[0],
                index: d[4],
                start: d[0].start,
                end: tokenEnd(d[6])
            })
        %}

indexed_assignment
    -> unary_expression _ "[" _ expression _ "]" _ "=" _ expression
        {%
            d => ({
                type: "indexed_assignment",
                subject: d[0],
                index: d[4],
                value: d[10],
                start: d[0].start,
                end: d[10].end
            })
        %}

while_loop
    -> "while" __ expression __ code_block
        {%
            d => ({
                type: "while_loop",
                condition: d[2],
                body: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}

if_statement
    -> "if" __ expression __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ if_statement
       {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
       %}

for_loop
    -> "for" __ identifier __ "in" __ expression _ code_block
        {%
            d => ({
                type: "for_loop",
                loop_variable: d[2],
                iterable: d[6],
                body: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}

argument_list
    -> null {% () => [] %}
    |  _ expression _  {% d => [d[1]] %}
    |  _ expression _ "," argument_list
        {%
            d => [d[1], ...d[4]]
        %}

expression -> boolean_expression         {% id %}

boolean_expression
    -> comparison_expression     {% id %}
    |  comparison_expression _ boolean_operator _ boolean_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

boolean_operator
    -> "and"      {% id %}
    |  "or"       {% id %}

comparison_expression
    -> additive_expression    {% id %}
    |  additive_expression _ comparison_operator _ comparison_expression
        {%
            d => ({
                type: "binary_operation",
                operator: d[2],
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

comparison_operator
    -> ">"   {% convertTokenId %}
    |  ">="  {% convertTokenId %}
    |  "<"   {% convertTokenId %}
    |  "<="  {% convertTokenId %}
    |  "=="  {% convertTokenId %}

additive_expression
    -> multiplicative_expression    {% id %}
    |  multiplicative_expression _ [+-] _ additive_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

multiplicative_expression
    -> unary_expression     {% id %}
    |  unary_expression _ [*/%] _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

unary_expression
    -> number               {% id %}
    |  identifier
        {%
            d => ({
                type: "var_reference",
                var_name: d[0],
                start: d[0].start,
                end: d[0].end
            })
        %}
    |  call_expression      {% id %}
    |  string_literal       {% id %}
    |  list_literal         {% id %}
    |  dictionary_literal   {% id %}
    |  boolean_literal      {% id %}
    |  indexed_access       {% id %}
    |  fun_expression       {% id %}
    |  "(" expression ")"
        {%
            data => data[1]
        %}

list_literal
    -> "[" list_items "]"
        {%
            d => ({
                type: "list_literal",
                items: d[1],
                start: tokenStart(d[0]),
                end: tokenEnd(d[2])
            })
        %}

list_items
    -> null
        {% () => [] %}
    |  _ml expression _ml
        {% d => [d[1]] %}
    |  _ml expression _ml "," list_items
        {%
            d => [
                d[1],
                ...d[4]
            ]
        %}

dictionary_literal
    -> "{" dictionary_entries "}"
        {%
            d => ({
                type: "dictionary_literal",
                entries: d[1],
                start: tokenStart(d[0]),
                end: tokenEnd(d[2])
            })
        %}

dictionary_entries
    -> null  {% () => [] %}
    |  _ml dictionary_entry _ml
        {%
            d => [d[1]]
        %}
    |  _ml dictionary_entry _ml "," dictionary_entries
        {%
            d => [d[1], ...d[4]]
        %}

dictionary_entry
    -> identifier _ml ":" _ml expression
        {%
            d => [d[0], d[4]]
        %}

boolean_literal
    -> "true"
        {%
            d => ({
                type: "boolean_literal",
                value: true,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}
    |  "false"
        {%
            d => ({
                type: "boolean_literal",
                value: false,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}

fun_expression
    -> "fun" _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "fun_expression",
                parameters: d[4],
                body: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}

line_comment -> %comment {% convertTokenId %}

string_literal -> %string_literal {% convertTokenId %}

number -> %number_literal {% convertTokenId %}

identifier -> %identifier {% convertTokenId %}

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> %ws
    |  "\n"

__ -> %ws:+

_ -> %ws:*
