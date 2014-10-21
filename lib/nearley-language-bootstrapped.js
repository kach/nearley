// Generated automatically by nearley
(function () {

function Rule(name, symbols, postprocess) {
    this.name = name;
    this.symbols = symbols;
    this.postprocess = postprocess;
};
Rule.prototype.serializeRule =
    (function() {
         var serializePostprocessor = function(p) {
             return p ? ', "postprocess": ' + p.toString()
                      : '';
         };
         var serializeSymbol = function(s) {
             return (s instanceof RegExp) ? s.toString()
                                          : JSON.stringify(s);
         };
         return function() {
             return '{'
               + '"name": ' + JSON.stringify(this.name)
               + ', "symbols": [' + this.symbols.map(serializeSymbol).join(', ') + ']'
               + serializePostprocessor(this.postprocess)
               + '}';
         };
     })();
// rewrite a rule into a set, eg for string sequences
// this is were rewrites to the base grammar happen
Rule.prototype.expandRule =
   (function () {
        var unique = (function () {
            var un = 0;
            return function (name) { return name + '$' + (++un); };
        })();
        var joiner = function (d) { return d.join(''); }
        var expandLiteral = function (rulename){
            return function (symbol) {
                       return (typeof(symbol.literal) != "undefined")
                              ? ((symbol.literal.length > 1)
                                 ? (function () {
                                        var name = unique(rulename);
                                        return [ name,
                                                 new Rule(name,
                                                          symbol.literal
                                                                .split("")
                                                                .map( function (c) {
                                                                          return { literal: c };
                                                                      } ),
                                                          joiner)
                                                ];
                                    })()
                                 : [symbol, []]
                                 )
                              : [symbol, []];
            }
        };

        return (
            function () {
                // for each token with length > 1,
                // replace it with a named rule that is the expanded sequence of characters
                var s1 = this.symbols.map( expandLiteral(this.name) );
                var newRule = new Rule( this.name,
                                        s1.map( function (s) { return s[0]; } ),
                                        this.postprocess
                                       );
                var subsidiaryRules = s1.map( function (s) { return s[1]; } );
                return [newRule].concat(subsidiaryRules);
            }
        )
    })();

var Compile = function (prog) {
    var outputRules = prog
        .filter( function (p) { return p.name; } )
        .reduce( function (rs, rest) { return rs.concat( rest ); },
                 [] );
    var body = prog.filter( function (p) { return p.body; } )
                   .map( function (b) { return b.body; } );
    var start = (outputRules.length != 0) ? outputRules[0].name : "";
    return { rules: outputRules, body: body, start: start };
}

var Generate = function (exportName) {
    var serializeRules = function (rules) {
        return   "[\n    "
               + rules.map( function (r) { return r.serializeRule(); } )
                      .join(',\n    ')
               + "\n]";
    }
    return function (parser) {
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
    	output += "   window." + exportName + " = grammar;\n";
    	output += "}\n";
    	output += "})();\n";
    	return output;
    }
};


var grammar = {
    ParserRules: [
    {"name": "final", "symbols": ["whit?", "prog", "whit?"], "postprocess":  function(d) { return function (parserName) { return Generate(parserName)(Compile(d[1])); } } },
    {"name": "prog", "symbols": ["prod"], "postprocess":  function(d) { return d[0]; } },
    {"name": "prog", "symbols": ["prog", "whit", "prod"], "postprocess":  function(d) { return d[0].concat(d[2]); } },
    {"name": "prod", "symbols": ["word", "whit?", "prod$27", "whit?", "expression+"], "postprocess":  function(d) {
             return d[4].map( function (r) {
                                  return (new Rule(d[0], r.symbols, r.postprocess)).expandRule(); } )
                        .reduce( function (rs, rest) { return rs.concat( rest ); },
                                 []);
         } },
    {"name": "prod$27", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function (d) { return d.join(''); }},
    {"name": "prod", "symbols": [{"literal":"@"}, "whit?", "js"], "postprocess":  function(d) { return [{body: d[2]}]; } },
    {"name": "expression+", "symbols": ["completeexpression"]},
    {"name": "expression+", "symbols": ["expression+", "whit?", {"literal":"|"}, "whit?", "completeexpression"], "postprocess":  function(d) { return d[0].concat([d[4]]); } },
    {"name": "completeexpression", "symbols": ["expr"], "postprocess":  function(d) { return {symbols: ((d[0] == "null") ? [] : d[0])}; } },
    {"name": "completeexpression", "symbols": ["expr", "whit?", "js"], "postprocess":  function(d) { return {symbols: ((d[0] == "null") ? [] : d[0]), postprocess: d[2]}; } },
    {"name": "expr", "symbols": ["word"]},
    {"name": "expr", "symbols": ["string"]},
    {"name": "expr", "symbols": ["charclass"]},
    {"name": "expr", "symbols": ["expr", "whit", "word"], "postprocess":  function(d){ return d[0].concat([d[2]]); } },
    {"name": "expr", "symbols": ["expr", "whit", "string"], "postprocess":  function(d){ return d[0].concat([d[2]]); } },
    {"name": "expr", "symbols": ["expr", "whit", "charclass"], "postprocess":  function(d) { return d[0].concat([d[2]]); } },
    {"name": "word", "symbols": [/[\w\?\+]/], "postprocess":  function(d){ return d[0]; } },
    {"name": "word", "symbols": ["word", /[\w\?\+]/], "postprocess":  function(d){ return d[0]+d[1]; } },
    {"name": "string", "symbols": [{"literal":"\""}, "charset", {"literal":"\""}], "postprocess":  function(d) { return { literal: d[1].join("") }; } },
    {"name": "charset", "symbols": []},
    {"name": "charset", "symbols": ["charset", "char"], "postprocess":  function(d) { return d[0].concat([d[1]]); } },
    {"name": "char", "symbols": [/[^\\"]/], "postprocess":  function(d) { return d[0]; } },
    {"name": "char", "symbols": [{"literal":"\\"}, /./], "postprocess":  function(d) { return JSON.parse("\""+"\\"+d[1]+"\""); } },
    {"name": "charclass", "symbols": [{"literal":"."}], "postprocess":  function(d) { return new RegExp("."); } },
    {"name": "charclass", "symbols": [{"literal":"["}, "charclassmembers", {"literal":"]"}], "postprocess":  function(d) { return new RegExp("[" + d[1].join('') + "]"); } },
    {"name": "charclassmembers", "symbols": []},
    {"name": "charclassmembers", "symbols": ["charclassmembers", "charclassmember"], "postprocess":  function(d) { return d[0].concat([d[1]]); } },
    {"name": "charclassmember", "symbols": [/[^\\\]]/], "postprocess":  function(d) { return d[0]; } },
    {"name": "charclassmember", "symbols": [{"literal":"\\"}, /./], "postprocess":  function(d) { return d[0] + d[1]; } },
    {"name": "js", "symbols": [{"literal":"{"}, {"literal":"%"}, "jscode", {"literal":"%"}, {"literal":"}"}], "postprocess":  function(d) { return d[2]; } },
    {"name": "jscode", "symbols": [], "postprocess":  function() {return "";} },
    {"name": "jscode", "symbols": ["jscode", /[^%]/], "postprocess":  function(d) {return d[0] + d[1];} },
    {"name": "whit", "symbols": ["whitraw"]},
    {"name": "whit", "symbols": ["whitraw?", "comment", "whit?"]},
    {"name": "whit?", "symbols": []},
    {"name": "whit?", "symbols": ["whit"]},
    {"name": "whitraw", "symbols": [/[\s]/]},
    {"name": "whitraw", "symbols": ["whitraw", /[\s]/]},
    {"name": "whitraw?", "symbols": []},
    {"name": "whitraw?", "symbols": ["whitraw"]},
    {"name": "comment", "symbols": [{"literal":"#"}, "commentchars", {"literal":"\n"}]},
    {"name": "commentchars", "symbols": []},
    {"name": "commentchars", "symbols": ["commentchars", /[^\n]/]}
]
  , ParserStart: "final"
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.parseGrammar = grammar;
}
})();
