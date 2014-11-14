// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "S", "symbols": [{"literal":"a"}, "S"]},
    {"name": "S", "symbols": ["C"]},
    {"name": "C", "symbols": [{"literal":"a"}, "C", {"literal":"b"}]},
    {"name": "C", "symbols": []}
]
  , ParserStart: "S"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
