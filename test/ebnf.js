// Generated automatically by nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "test", "symbols": [" ebnf$1", " ebnf$2", " ebnf$3"]},
    {"name": "undefined$4", "symbols": [{"literal":"a"}, {"literal":"b"}, {"literal":"c"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " ebnf$1", "symbols": ["undefined$4"], "postprocess": id},
    {"name": " ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": " ebnf$2", "symbols": []},
    {"name": " ebnf$2", "symbols": [" subexpression$5", " ebnf$2"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " ebnf$3", "symbols": [{"literal":"p"}]},
    {"name": " ebnf$3", "symbols": [{"literal":"p"}, " ebnf$3"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }},
    {"name": " subexpression$5", "symbols": [{"literal":"x"}, {"literal":"y"}, {"literal":"z"}]}
]
  , ParserStart: "test"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
