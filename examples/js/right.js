// Generated automatically by nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "c", "symbols": []},
    {"name": "c", "symbols": [{"literal":"."}, "c"]}
]
  , ParserStart: "c"
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
