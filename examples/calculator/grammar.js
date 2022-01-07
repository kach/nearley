// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const bin = (([x, op, y]) => op(x,y));
const Null = (d => null);
const fac = n => (n===0)?1:n*fac(n-1);
const unaryPost = (([p, op]) => op(p));
const funApply = ([fun, arg]) => fun(arg);
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": [], "postprocess": d => ""},
    {"name": "main", "symbols": ["AS", "_"], "postprocess": function(d) {return d[0]; }},
    {"name": "AS", "symbols": ["AS", "PLUS", "MD"], "postprocess": bin},
    {"name": "AS", "symbols": ["AS", "MINUS", "MD"], "postprocess": bin},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "MULT", "E"], "postprocess": bin},
    {"name": "MD", "symbols": ["MD", "DIV", "E"], "postprocess": bin},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "E", "symbols": ["F", "EXP", "E"], "postprocess": bin},
    {"name": "E", "symbols": ["F"], "postprocess": id},
    {"name": "F", "symbols": ["P", "FACTORIAL"], "postprocess": unaryPost},
    {"name": "F", "symbols": ["P"], "postprocess": id},
    {"name": "P", "symbols": ["Q"]},
    {"name": "P", "symbols": ["FLOAT"], "postprocess": id},
    {"name": "P", "symbols": ["SIN", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["COS", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["TAN", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["ASIN", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["ACOS", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["ATAN", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["PI"], "postprocess": id},
    {"name": "P", "symbols": ["EULER"], "postprocess": id},
    {"name": "P", "symbols": ["SQRT", "Q"], "postprocess": funApply},
    {"name": "P", "symbols": ["LN", "Q"], "postprocess": funApply},
    {"name": "Q", "symbols": ["LP", "AS", "RP"], "postprocess": ([lp, as, rp]) => as},
    {"name": "FLOAT", "symbols": ["_", "float"], "postprocess": d => d[1]},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {return parseInt(d[0])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null; }},
    {"name": "PLUS", "symbols": ["_", {"literal":"+"}], "postprocess": function(d) {return ((a,b) => a+b); }},
    {"name": "MINUS", "symbols": ["_", {"literal":"-"}], "postprocess": function(d) {return ((a,b) => a-b); }},
    {"name": "MULT", "symbols": ["_", {"literal":"*"}], "postprocess": function(d) {return ((a,b) => a*b); }},
    {"name": "DIV", "symbols": ["_", {"literal":"/"}], "postprocess": function(d) {return ((a,b) => a/b); }},
    {"name": "EXP", "symbols": ["_", {"literal":"^"}], "postprocess": function(d) {return ((a,b) => Math.pow(a,b)); }},
    {"name": "FACTORIAL", "symbols": [{"literal":"!"}], "postprocess": d => fac},
    {"name": "LP", "symbols": ["_", {"literal":"("}], "postprocess": Null},
    {"name": "RP", "symbols": ["_", {"literal":")"}], "postprocess": Null},
    {"name": "SIN$subexpression$1", "symbols": [/[sS]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "SIN", "symbols": ["_", "SIN$subexpression$1"], "postprocess": d => Math.sin},
    {"name": "COS$subexpression$1", "symbols": [/[cC]/, /[oO]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "COS", "symbols": ["_", "COS$subexpression$1"], "postprocess": d => Math.cos},
    {"name": "TAN$subexpression$1", "symbols": [/[tT]/, /[aA]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "TAN", "symbols": ["_", "TAN$subexpression$1"], "postprocess": d => Math.tan},
    {"name": "ASIN$subexpression$1", "symbols": [/[aA]/, /[sS]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ASIN", "symbols": ["_", "ASIN$subexpression$1"], "postprocess": d => Math.asin},
    {"name": "ACOS$subexpression$1", "symbols": [/[aA]/, /[cC]/, /[oO]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ACOS", "symbols": ["_", "ACOS$subexpression$1"], "postprocess": d => Math.acos},
    {"name": "ATAN$subexpression$1", "symbols": [/[aA]/, /[tT]/, /[aA]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ATAN", "symbols": ["_", "ATAN$subexpression$1"], "postprocess": d => Math.atan},
    {"name": "PI$subexpression$1", "symbols": [/[pP]/, /[iI]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PI", "symbols": ["_", "PI$subexpression$1"], "postprocess": d => Math.PI},
    {"name": "EULER$subexpression$1", "symbols": [/[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "EULER", "symbols": ["_", "EULER$subexpression$1"], "postprocess": d => Math.E},
    {"name": "SQRT$subexpression$1", "symbols": [/[sS]/, /[qQ]/, /[rR]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "SQRT", "symbols": ["_", "SQRT$subexpression$1"], "postprocess": d => Math.sqrt},
    {"name": "LN$subexpression$1", "symbols": [/[lL]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "LN", "symbols": ["_", "LN$subexpression$1"], "postprocess": d => Math.log}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.arithmetic = grammar;
}
})();
