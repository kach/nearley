(function () {

function serializeRules(rules) {
    return "[\n    " + rules.map(serializeRule).join(",\n    ") + "\n]";
}

function dedentFunc(func) {
    var lines = func.toString().split(/\n/);

    if (lines.length === 1) {
        return [lines[0].replace(/^\s+|\s+$/g, '')];
    }

    var match = /^\s*/.exec(lines[lines.length-1]);
    var indent = match[0];
    return lines
        .map(function dedent(line) {
            if (line.slice(0, indent.length) === indent) {
                return line.slice(indent.length);
            }
            return line;
        });
}

function serializeSymbol(s) {
    return (s instanceof RegExp) ? s.toString()
                                 : JSON.stringify(s);
}

function serializeRule(rule) {
    var ret = '{';
    ret += '"name": ' + JSON.stringify(rule.name);
    ret += ', "symbols": [' + rule.symbols.map(serializeSymbol).join(', ') + ']';
    if (rule.postprocess) {
        var lines = dedentFunc(rule.postprocess);
        ret += ', "postprocess": ' + lines.map(function indent(line, i) {
            if (i > 0) {
                line = '    ' + line;
            }
            return line;
        }).join('\n');
    }
    ret += '}';
    return ret;
}

var generate = function (parser, exportName) {
    var output = "// Generated automatically by nearley\n";
    output +=  "// http://github.com/Hardmath123/nearley\n";
    output += "(function () {\n";
    output += "function id(x) {return x[0]; }\n";
    output += parser.body.join('\n');
    output += "var grammar = {\n";
    output += "    ParserRules: " + serializeRules(parser.rules) + "\n";
    output += "  , ParserStart: " + JSON.stringify(parser.start) + "\n";
    output += "}\n";
    output += "if (typeof module !== 'undefined'"
        + "&& typeof module.exports !== 'undefined') {\n";
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
