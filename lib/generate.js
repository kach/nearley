(function () {

function serializeRules(rules) {
    return "[\n    " + rules.map(serializeRule).join(",\n    ") + "\n]";
}

function dedentFunc(func) {
    var lines = func.toString().split(/\n/);

    if (lines.length === 1) {
        return [lines[0].replace(/^\s+|\s+$/g, '')];
    }

    var indent = null;
    var tail = lines.slice(1);
    for (var i = 0; i < tail.length; i++) {
        var match = /^\s*/.exec(tail[i]);
        if (match) {
            if (indent === null ||
                match[0].length < indent.length) {
                indent = match[0];
            }
        }
    }

    if (indent === null) {
        return lines;
    }

    return lines.map(function dedent(line) {
        if (line.slice(0, indent.length) === indent) {
            return line.slice(indent.length);
        }
        return line;
    });
}
function tabulateString(string, indent, filter) {
  if(Array.isArray(string)) {
    string = string.join('\n');
  }
  tabulated = string.toString().split('\n').map(function addIndent(line, i) {
      if(filter) {
        if(filter.call(line, i)) {
          return indent + line;
        } else {
          return line;
        }
      } else {
        return indent + line;
      }
  }).join('\n');
  return tabulated;
}

function serializeSymbol(s) {
    return (s instanceof RegExp) ? s.toString()
                                 : JSON.stringify(s);
}

function id(a) {
  return a;
}

function serializeRule(rule) {
    var ret = '{';
    ret += '"name": ' + JSON.stringify(rule.name);
    ret += ', "symbols": [' + rule.symbols.map(serializeSymbol).join(', ') + ']';
    if (rule.postprocess) {
        ret += ', "postprocess": ' + tabulateString(dedentFunc(rule.postprocess), '    ', id);
    }
    ret += '}';
    return ret;
}

var generate = function (parser, exportName) {
    return (generate[parser.config.preprocessor] ?
      generate[parser.config.preprocessor] :
      generate["_default"]
    )(parser, exportName);
};

generate.js = generate._default = generate.javascript = function (parser, exportName) {
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

generate.cs = generate.coffee = generate.coffeescript = function (parser, exportName) {
    var output = "# Generated automatically by nearley\n";
    output +=  "# http://github.com/Hardmath123/nearley\n";
    output += "do ->\n";
    output += "  id = (d)->d[0]\n";
    output += tabulateString(dedentFunc(parser.body.join('\n')), '  ') + '\n';
    output += "  grammar = {\n";
    output += "    ParserRules: " + tabulateString(serializeRules(parser.rules), '      ', id) + ",\n";
    output += "    ParserStart: " + JSON.stringify(parser.start) + "\n";
    output += "  }\n";
    output += "  if typeof module != 'undefined' "
        + "&& typeof module.exports != 'undefined'\n";
    output += "    module.exports = grammar;\n";
    output += "  else\n";
    output += "    window." + exportName + " = grammar;\n";
    return output;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = generate;
} else {
   window.generate = generate;
}
})();
