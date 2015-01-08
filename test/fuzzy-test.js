// Generated automatically by nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "fin", "symbols": ["method"]},
    {"name": "method", "symbols": ["state", {"literal":"."}, "statemethod"]},
    {"name": " string$1", "symbols": [{"literal":"w"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "statemethod", "symbols": [" string$1"]},
    {"name": " string$2", "symbols": [{"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "state", "symbols": [" string$2"]}
]
  , ParserStart: "fin"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
