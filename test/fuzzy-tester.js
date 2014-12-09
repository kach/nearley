var grammar = require("./fuzzy-test.js");
var nearley = require("../lib/nearley.js");
var fs = require("fs");
var js_parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart,true, 3);
details=new Object();
details.encoding="ascii";
///home/jacob/nearley/examples/js/javascript.js
js_parser.feed("awe");
//console.log(js_parser.results);
for(i in js_parser.results){
    console.log("Final: "+JSON.stringify(js_parser.results[i]));
}
