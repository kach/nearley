(function () {
function serializeRules(rules) {
    var serializePostprocessor = function(p) {
        if (p) {
            return '"postprocess": ' + p.toString() + ",";
        } else {
            return "";
        }
    };
    var serializeSymbol = function(s) {
        if (s instanceof RegExp) {
            return s.toString();
        } else {
            return JSON.stringify(s);
        }
    };
    var serializeRule = function(rule) {
        return '{' + 
            '"name": ' + JSON.stringify(rule.name) + "," +
            serializePostprocessor(rule.postprocess) +
            '"symbols":' +
            "[ " + rule.symbols.map(serializeSymbol).join(", ") + " ]" +
            '}';
    };
    return "[ " + rules.map(serializeRule).join(", ") + " ]";
}

var generate = function (parser, exportName) {
	var output = "// Generated automatically by nearley\n";
	output += "(function () {\n";
    output += parser.body.join('\n');
	output += "var grammar = {\n";
	output += "    ParserRules: " + serializeRules(parser.rules) + "\n";
	output += "  , ParserStart: " + JSON.stringify(parser.start) + "\n";
	output += "}\n";
	output += "if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {\n";
	output += "   module.exports = grammar;\n";
	output += "} else {\n";
	output += "   window.grammar = grammar;\n";
	output += "}\n";
	output += "})();\n";
	return output;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = generate;
} else {
   window.generate = generate;
}
})();