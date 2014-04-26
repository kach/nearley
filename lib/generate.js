var inlineRequire = require('../lib/inline-require.js');
var serialize = require('../lib/serialize.js');

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

module.exports = function generate(parser, exportName) {
	var output = "";

	output += comment("Generated automatically by nearley.");
	output += assign(exportName, wrap(
        variable('nearley', inlineRequire(require, '../lib/nearley.js')) +
        variable('id', serialize(id)) +
        (parser.body ? parser.body.join('\n') : "") +
        "\n" +
        retn(call("new nearley.Parser", [serialize(parser.rules), JSON.stringify(parser.start)]))
    ));

	return output;
};
