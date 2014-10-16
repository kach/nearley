(function () {
function serializeRules(rules) {
    var serializePostprocessor = function(p) {
        return p ? ', "postprocess": ' + p.toString()
                 : '';
    };
    var serializeSymbol = function(s) {
        return (s instanceof RegExp) ? s.toString()
                                     : JSON.stringify(s);
    };
    var serializeRule = function(rule) {
        return '{'
          + '"name": ' + JSON.stringify(rule.name)
          + ', "symbols": [' + rule.symbols.map(serializeSymbol).join(', ') + ']'
          + serializePostprocessor(rule.postprocess)
          + '}';
    };
    return "[\n    " + rules.map(serializeRule).join(",\n    ") + "\n]";
}

var generate = function (parser, exportName) {
	var output = "// Generated automatically by nearley\n";
	output += "(function () {\n";
    output += "function id(x) {return x[0]; }\n";
    output += parser.body.join('\n');
	output += "var grammar = {\n";
	output += "    ParserRules: " + serializeRules(parser.rules) + "\n";
	output += "  , ParserStart: " + JSON.stringify(parser.start) + "\n";
	output += "}\n";
	output += "if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {\n";
	output += "   module.exports = grammar;\n";
	output += "} else {\n";
	output += "   window." + exportName + " = grammar;\n";
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
