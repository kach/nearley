(function () {

var EJS;
var fs;

if(typeof require !== "undefined") {
    EJS = require("ejs");

    try {
        fs = require('fs');
    } catch (e) {} // Browser
} else {
    EJS = ejs;
}

var generate = function (parser, exportName, template) {
    if(typeof ejs !== "undefined") {
        throw new Error("Generation of code requires (EJS)[https://github.com/tj/ejs]");
    }
    if(!template) {
        parser.config.template = parser.config.template || parser.config.preprocessor || "javascript";
        try {
            template = fs.readFileSync(__dirname + "/templates/" + parser.config.template + ".ejs", "utf8");
        } catch(e) {
            console.warn(parser.config.template + " template not found!");
            console.warn("Using default, built-in (javascript) template");
            template = "<%\n\
var s = JSON.stringify.bind(JSON)\n\
%>// Generated automatically by nearley\n\
// http://github.com/Hardmath123/nearley\n\
(function () {\n\
function id(x) {return x[0]; }\n\
<%- parser.body.join('') %>\n\
var grammar = {\n\
    ParserRules: [\n\
    <% for(var i in parser.rules) { var rule = parser.rules[i] %><%\n\
      %>{<%\n\
        %>\"name\": <%- s(rule.name) %>, <%\n\
        %>\"symbols\": [<%-\n\
          rule.symbols.map(function (symbol) {\n\
            return (symbol instanceof RegExp) ? symbol.toString()\n\
                                              : s(symbol);\n\
          }).join(\", \");\n\
        %>]<%\n\
        %><% if(rule.postprocess) { %>, \"postprocess\": <%- rule.postprocess.toString() %><% } %><%\n\
      %>}<%- i != parser.rules.length -1 ? \",\\n    \": \"\" %><%\n\
    %><% } %>\n\
  ],\n\
    ParserStart: <%- s(parser.start) %>\n\
};\n\
\n\
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {\n\
    module.exports = grammar;\n\
} else {\n\
    window.<%- exportName %> = grammar;\n\
}\n\
})();"
        }
    }

    var output = EJS.render(template, {parser: parser, exportName: exportName});

    return output;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = generate;
} else {
    window.generate = generate;
}
})();
