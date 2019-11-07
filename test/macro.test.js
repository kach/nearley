pluginTester = require('babel-plugin-tester')
plugin = require('babel-plugin-macros')

describe("macro", function() {
    pluginTester({
      plugin,
      babelOptions: {filename: __filename, parserOpts: {plugins: ['jsx']}},
      tests: {
        'babel macro produces correct output': {
            code: `
              const macro = require("../macro");
              macro("./grammars/whitespace.ne");
            `,
            output: `
      (() => {
        (function () {
          function id(x) {
            return x[0];
          }

          var grammar = {
            Lexer: undefined,
            ParserRules: [{
              "name": "_$ebnf$1",
              "symbols": []
            }, {
              "name": "_$ebnf$1",
              "symbols": ["_$ebnf$1", "wschar"],
              "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
              }
            }, {
              "name": "_",
              "symbols": ["_$ebnf$1"],
              "postprocess": function (d) {
                return null;
              }
            }, {
              "name": "__$ebnf$1",
              "symbols": ["wschar"]
            }, {
              "name": "__$ebnf$1",
              "symbols": ["__$ebnf$1", "wschar"],
              "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
              }
            }, {
              "name": "__",
              "symbols": ["__$ebnf$1"],
              "postprocess": function (d) {
                return null;
              }
            }, {
              "name": "wschar",
              "symbols": [/[ \\t\\n\\v\\f]/],
              "postprocess": id
            }, {
              "name": "d",
              "symbols": ["a"]
            }, {
              "name": "a",
              "symbols": ["b", "_", {
                "literal": "&"
              }]
            }, {
              "name": "a",
              "symbols": ["b"]
            }, {
              "name": "b",
              "symbols": ["letter"]
            }, {
              "name": "b",
              "symbols": [{
                "literal": "("
              }, "_", "d", "_", {
                "literal": ")"
              }]
            }, {
              "name": "letter",
              "symbols": [/[a-z]/]
            }],
            ParserStart: "d"
          };

          if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            module.exports = grammar;
          } else {
            window.grammar = grammar;
          }
        })();
      })();
            `
        }
      },
    })
})
