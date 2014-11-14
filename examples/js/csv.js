// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var grammar = {
    ParserRules: [
    {"name": "file", "symbols": ["header", "newline", "rows"], "postprocess":  function (d) { return { header: d[0], rows: d[2] }; } },
    {"name": "header", "symbols": ["row"], "postprocess":  id },
    {"name": "rows", "symbols": ["row"]},
    {"name": "rows", "symbols": ["rows", "newline", "row"], "postprocess":  appendItem(0,2) },
    {"name": "row", "symbols": ["field"]},
    {"name": "row", "symbols": ["row", {"literal":","}, "field"], "postprocess":  appendItem(0,2) },
    {"name": "field", "symbols": ["unquoted_field"], "postprocess":  id },
    {"name": "field", "symbols": [{"literal":"\""}, "quoted_field", {"literal":"\""}], "postprocess":  function (d) { return d[1]; } },
    {"name": "quoted_field", "symbols": [], "postprocess":  emptyStr },
    {"name": "quoted_field", "symbols": ["quoted_field", "quoted_field_char"], "postprocess":  appendItemChar(0,1) },
    {"name": "quoted_field_char", "symbols": [/[^"]/], "postprocess":  id },
    {"name": "quoted_field_char", "symbols": [{"literal":"\""}, {"literal":"\""}], "postprocess":  function (d) { return "\""; } },
    {"name": "unquoted_field", "symbols": [], "postprocess":  emptyStr },
    {"name": "unquoted_field", "symbols": ["unquoted_field", "char"], "postprocess":  appendItemChar(0,1) },
    {"name": "char", "symbols": [/[^\n\r",]/], "postprocess":  empty },
    {"name": "newline", "symbols": [{"literal":"\r"}, {"literal":"\n"}], "postprocess":  empty },
    {"name": "newline", "symbols": [{"literal":"\r"}]},
    {"name": "newline", "symbols": [{"literal":"\n"}], "postprocess":  empty }
]
  , ParserStart: "file"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
