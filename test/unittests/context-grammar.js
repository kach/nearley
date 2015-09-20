// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "program", "symbols": ["_", "uc", "_"], "postprocess":  function (d) { return this.id(d[1]) } },
    {"name": "program", "symbols": ["_", "lc", "_"], "postprocess":  function (d) { return this.id(d[1]) } },
    {"name": " string$1", "symbols": [{"literal":"t"}, {"literal":"o"}, {"literal":"u"}, {"literal":"p"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "uc", "symbols": [" string$1", "_", "string"], "postprocess":  function (d) { return this.toUpper(d[2]) } },
    {"name": " string$2", "symbols": [{"literal":"t"}, {"literal":"o"}, {"literal":"l"}, {"literal":"o"}, {"literal":"w"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "lc", "symbols": [" string$2", "_", "string"], "postprocess":  function (d) { return this.toLower(d[2]) } },
    {"name": "string", "symbols": [{"literal":"'"}, " ebnf$3", {"literal":"'"}], "postprocess":  function (d) { return this.string(d[1]) } },
    {"name": "_", "symbols": [], "postprocess":  function(d) { return this.null(); } },
    {"name": "_", "symbols": [/[\s]/, "_"], "postprocess":  function(d) {return this.null(); } },
    {"name": " ebnf$3", "symbols": []},
    {"name": " ebnf$3", "symbols": [/[a-zA-Z ]/, " ebnf$3"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
