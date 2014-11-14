// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "S", "symbols": ["A", "A", "A", "A"]},
    {"name": "A", "symbols": [{"literal":"a"}]},
    {"name": "A", "symbols": ["E"]},
    {"name": "E", "symbols": []}
]
  , ParserStart: "S"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
