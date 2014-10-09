var inlineRequire = require('../lib/inline-require.js');

function variable(v, value) {
    return "var " + assign(v, value);
}

function assign(v, value) {
    return v + " = " + value + ";\n";
}

function comment(value) {
    return "// " + value + "\n";
}

function wrap(body) {
    return "function () {\n" + indent(body) + "}";
}

function indent(body) {
    return body.replace(/^/mg, '    ');
}

function retn(stmt) {
    return "return " + stmt;
}

function call(fn, params) {
    return fn + "(" + params.join(', ') + ");";
}

function id(d) {
    return d[0];
}

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

module.exports = function generate(parser, exportName) {
	var output = "";

	output += comment("Generated automatically by nearley.");
	output += assign(exportName, wrap(
        variable('nearley', inlineRequire(require, '../lib/nearley.js')) +
        variable('id', id.toString()) +
        (parser.body ? parser.body.join('\n') : "") +
        "\n" +
        retn(call("new nearley.Parser", [serializeRules(parser.rules), JSON.stringify(parser.start)]))
    ));

	return output;
};
