// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

var ws = {literal: " "};
var number = {test: function(n) {
    return n.constructor === Number;
}};
var grammar = {
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1", "symbols": [number, ws, number]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": [number, ws, number]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$2", "main$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "main", "symbols": [number, "main$ebnf$1"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
