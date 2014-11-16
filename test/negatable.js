// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "variable", "symbols": [" ebnf$1"], "postprocess": 
    function(d, pos, reject) {
        if (d[0].join("") !== "if") {
            return d[0].join("");
        } else  {
            return reject;
        }
    }
},
    {"name": " ebnf$1", "symbols": [/[a-z]/]},
    {"name": " ebnf$1", "symbols": [/[a-z]/, " ebnf$1"], "postprocess": function (d) {
                    return [d[0]].concat(d[1]);
                }}
]
  , ParserStart: "variable"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
