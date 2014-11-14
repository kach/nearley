// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "P", "symbols": ["S"]},
    {"name": "S", "symbols": ["S", {"literal":"+"}, "M"]},
    {"name": "S", "symbols": ["M"]},
    {"name": "M", "symbols": ["M", {"literal":"*"}, "T"]},
    {"name": "M", "symbols": ["T"]},
    {"name": "T", "symbols": [{"literal":"1"}]},
    {"name": "T", "symbols": [{"literal":"2"}]},
    {"name": "T", "symbols": [{"literal":"3"}]},
    {"name": "T", "symbols": [{"literal":"4"}]}
]
  , ParserStart: "P"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
