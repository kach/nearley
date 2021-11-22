(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./nearley'));
    } else {
        root.generate = factory(root.nearley);
    }
}(this, function(nearley) {

    function serializeRules(rules, builtinPostprocessors, extraIndent) {
        if (extraIndent == null) {
            extraIndent = ''
        }

        return '[\n    ' + rules.map(function(rule) {
            return serializeRule(rule, builtinPostprocessors);
        }).join(',\n    ') + '\n' + extraIndent + ']';
    }

    function dedent(line, indent) {
        if (line.slice(0, indent.length) === indent) {
            return line.slice(indent.length);
        }
        return line;
    }

    function dedentMultiline(multiline, indent) {
        return multiline.split("\n").map(function (line) {
            return dedent(line, indent);
        }).join("\n");
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
            if (match && match[0].length !== tail[i].length) {
                if (indent === null ||
                    match[0].length < indent.length) {
                    indent = match[0];
                }
            }
        }

        if (indent === null) {
            return lines;
        }

        return lines.map(function (line) {
            return dedent(line, indent);
        });
    }

    function tabulateString(string, indent, options) {
        var lines;
        if(Array.isArray(string)) {
          lines = string;
        } else {
          lines = string.toString().split('\n');
        }

        options = options || {};
        var tabulated = lines.map(function addIndent(line, i) {
            var shouldIndent = true;

            if(i == 0 && !options.indentFirst) {
              shouldIndent = false;
            }

            if(shouldIndent) {
                return indent + line;
            } else {
                return line;
            }
        }).join('\n');

        return tabulated;
    }

    function serializeSymbol(s) {
        if (s instanceof RegExp) {
            return s.toString();
        } else if (s.token) {
            return s.token;
        } else {
            return JSON.stringify(s);
        }
    }

    function serializeRule(rule, builtinPostprocessors) {
        var ret = '{';
        ret += '"name": ' + JSON.stringify(rule.name);
        ret += ', "symbols": [' + rule.symbols.map(serializeSymbol).join(', ') + ']';
        if (rule.postprocess) {
            if(rule.postprocess.builtin) {
                rule.postprocess = builtinPostprocessors[rule.postprocess.builtin];
            }
            ret += ', "postprocess": ' + tabulateString(dedentFunc(rule.postprocess), '        ', {indentFirst: false});
        }
        ret += '}';
        return ret;
    }

    var generate = function (parser, exportName) {
        if(!parser.config.preprocessor) {
            parser.config.preprocessor = "_default";
        }

        if(!generate[parser.config.preprocessor]) {
            throw new Error("No such preprocessor: " + parser.config.preprocessor)
        }

        return generate[parser.config.preprocessor](parser, exportName);
    };

    generate.js = generate._default = generate.javascript = function (parser, exportName) {
        var output = `// Generated automatically by nearley, version ${parser.version}
        // http://github.com/Hardmath123/nearley
        (function () {
        function id(x) { return x[0]; }
        ${parser.body.join('\n')}var grammar = {
            Lexer: ${parser.config.lexer},
            ParserRules: ${serializeRules(parser.rules, generate.javascript.builtinPostprocessors)}
          , ParserStart: ${JSON.stringify(parser.start)}
        };
        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
           module.exports = grammar;
        } else {
           window.${exportName} = grammar;
        }
        })();
        `

        return dedentMultiline(output, "        ");
    };

    generate.javascript.builtinPostprocessors = {
        "joiner": "function joiner(d) {return d.join('');}",
        "arrconcat": "function arrconcat(d) {return [d[0]].concat(d[1]);}",
        "arrpush": "function arrpush(d) {return d[0].concat([d[1]]);}",
        "nuller": "function(d) {return null;}",
        "id": "id"
    }

    generate.module = generate.esmodule = function (parser, exportName) {
        var output = `// Generated automatically by nearley, version ${parser.version}
        // http://github.com/Hardmath123/nearley
        function id(x) { return x[0]; }
        ${parser.body.join('\n')}let Lexer = ${parser.config.lexer};
        let ParserRules = ${serializeRules(parser.rules, generate.javascript.builtinPostprocessors)};
        let ParserStart = ${JSON.stringify(parser.start)};
        export default { Lexer, ParserRules, ParserStart };
        `
        return dedentMultiline(output, "        ");
    };

    generate.cs = generate.coffee = generate.coffeescript = function (parser, exportName) {
        var output = `# Generated automatically by nearley, version ${parser.version}
        # http://github.com/Hardmath123/nearley
        do ->
          id = (d) -> d[0]
        ${tabulateString(dedentFunc(parser.body.join('\n')), '  ')}
          grammar = {
            Lexer: ${parser.config.lexer},
            ParserRules: ${
            tabulateString(
                    serializeRules(parser.rules, generate.coffeescript.builtinPostprocessors),
                    "      " + "        ",
                    {indentFirst: false})
            },
            ParserStart: ${JSON.stringify(parser.start)}
          }
          if typeof module != 'undefined' && typeof module.exports != 'undefined'
            module.exports = grammar;
          else
            window.${exportName} = grammar;
        `;

        return dedentMultiline(output, "        ");
    };

    generate.coffeescript.builtinPostprocessors = {
        "joiner": "(d) -> d.join('')",
        "arrconcat": "(d) -> [d[0]].concat(d[1])",
        "arrpush": "(d) -> d[0].concat([d[1]])",
        "nuller": "() -> null",
        "id": "id"
    };

    generate.ts = generate.typescript = function (parser, exportName) {
        var output = `// Generated automatically by nearley, version ${parser.version}
        // http://github.com/Hardmath123/nearley
        // Bypasses TS6133. Allow declared but unused functions.
        // @ts-ignore
        function id(d: any[]): any { return d[0]; }
        ${parser.customTokens.map(function (token) { return "declare var " + token + ": any;" }).join("\n")}
        ${parser.body.join('\n')}
        interface NearleyToken {
          value: any;
          [key: string]: any;
        };

        interface NearleyLexer {
          reset: (chunk: string, info: any) => void;
          next: () => NearleyToken | undefined;
          save: () => any;
          formatError: (token: never) => string;
          has: (tokenType: string) => boolean;
        };

        interface NearleyRule {
          name: string;
          symbols: NearleySymbol[];
          postprocess?: (d: any[], loc?: number, reject?: {}) => any;
        };

        type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

        interface Grammar {
          Lexer: NearleyLexer | undefined;
          ParserRules: NearleyRule[];
          ParserStart: string;
        };

        const grammar: Grammar = {
          Lexer: ${parser.config.lexer},
          ParserRules: ${serializeRules(parser.rules, generate.typescript.builtinPostprocessors, "  ")},
          ParserStart: ${JSON.stringify(parser.start)},
        };

        export default grammar;
        `;

        return dedentMultiline(output, "        ");
    };

    generate.typescript.builtinPostprocessors = {
        "joiner": "(d) => d.join('')",
        "arrconcat": "(d) => [d[0]].concat(d[1])",
        "arrpush": "(d) => d[0].concat([d[1]])",
        "nuller": "() => null",
        "id": "id"
    };

    return generate;

}));
