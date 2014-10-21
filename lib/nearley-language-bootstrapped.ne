# nearley grammar

@{%
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
        .map(function(d) {
                 return d.rules.map( function (r) {
                                         return (new Rule(d.name, r.symbols, r.postprocess)).expandRule(); } )
                            .reduce( function (rs, rest) { return rs.concat( rest ); },
                                     []);
             } )
        .reduce( function (rs, rest) { return rs.concat( rest ); },
                 [] )
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


%}


final -> whit? prog whit?  {% function(d) { return function (parserName) { return Generate(parserName)(Compile(d[1])); } } %}

prog -> prod  {% function(d) { return d[0]; } %}
      | prog whit prod  {% function(d) { return d[0].concat(d[2]); } %}

prod -> word whit? "->" whit? expression+ {% function (d) { return { name: d[0], rules: d[4] }; } %}
      | "@" whit? js  {% function(d) { return [{body: d[2]}]; } %}

expression+ -> completeexpression
             | expression+ whit? "|" whit? completeexpression  {% function(d) { return d[0].concat([d[4]]); } %}

completeexpression -> expr  {% function(d) { return {symbols: ((d[0] == "null") ? [] : d[0])}; } %}
                    | expr whit? js  {% function(d) { return {symbols: ((d[0] == "null") ? [] : d[0]), postprocess: d[2]}; } %}

expr -> word
      | string
      | charclass
      | expr whit word  {% function(d){ return d[0].concat([d[2]]); } %}
      | expr whit string  {% function(d){ return d[0].concat([d[2]]); } %}
      | expr whit charclass  {% function(d) { return d[0].concat([d[2]]); } %}

word -> [\w\?\+]  {% function(d){ return d[0]; } %}
      | word [\w\?\+]  {% function(d){ return d[0]+d[1]; } %}

string -> "\"" charset "\""  {% function(d) { return { literal: d[1].join("") }; } %}

charset -> null
         | charset char  {% function(d) { return d[0].concat([d[1]]); } %}

char -> [^\\"]  {% function(d) { return d[0]; } %}
      | "\\" .  {% function(d) { return JSON.parse("\""+"\\"+d[1]+"\""); } %}

charclass -> "."  {% function(d) { return new RegExp("."); } %}
           | "[" charclassmembers "]"  {% function(d) { return new RegExp("[" + d[1].join('') + "]"); } %}

charclassmembers -> null
                  | charclassmembers charclassmember  {% function(d) { return d[0].concat([d[1]]); } %}

charclassmember -> [^\\\]]  {% function(d) { return d[0]; } %}
                 | "\\" .  {% function(d) { return d[0] + d[1]; } %}

js -> "{" "%" jscode "%" "}"  {% function(d) { return d[2]; } %}

jscode -> null  {% function() {return "";} %}
        | jscode [^%]  {% function(d) {return d[0] + d[1];} %}

# Whitespace with a comment
whit -> whitraw
      | whitraw? comment whit?

# Optional whitespace with a comment
whit? -> null
       | whit

# Literally a string of whitespace
whitraw -> [\s]
         | whitraw [\s]

# A string of whitespace OR the empty string
whitraw? -> null
          | whitraw

comment -> "#" commentchars "\n"
commentchars -> null
              | commentchars [^\n]
