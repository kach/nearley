// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(() => {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "c", "symbols": []},
    {"name": "c", "symbols": [{"literal":"."}, "c"]}
]
  , ParserStart: "c"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
