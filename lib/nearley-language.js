var NullPP = function(argument) {return null;}

function rule(name, symbols, proc) {
    return { name: name, symbols: symbols, postprocess: proc };
}

function m(s) {
    return { literal: s };
}

module.exports = {
    rules: [
        rule("whit", [/\s/], NullPP),
        rule("whit", ["whit", /\s/], NullPP),
        rule("whit", ["whit?", "comment", "whit?"], NullPP),
        rule("whit?", [], NullPP),
        rule("whit?", ["whit"], NullPP),

        rule("comment", [m("#"), "commentchars", m("\n")], NullPP),
        rule("commentchars", [], NullPP),
        rule("commentchars", ["commentchars", /[^\n]/], NullPP),

        rule("js", [m("{"), m("%"), "jscode", m("%"), m("}")], function(d) {
            return d[2];
        }),
        rule("jscode", [], function() {return "";}),
        rule("jscode", ["jscode", /[^%]/], function(d) {return d[0] + d[1];}),

        rule("string", [m("\""), "charset", m("\"")], function(d) {
            return { type: "literal", data: d[1].join("") };
        }),
        rule("charset", []),
        rule("charset", ["charset", "char"], function(d) {
            return d[0].concat([d[1]]);
        }),
        rule("char", [ new RegExp("[^\"]")], function(d) {
            return d[0];
        }),
        rule("char", [ m("\\"), new RegExp(".") ], function(d) {
            return JSON.parse("\""+"\\"+d[1]+"\"");
        }),

        rule("charclass", [m("["), "charclassmembers", m("]")], function(d) {
            return new RegExp("[" + d[1].join('') + "]");
        }),

        rule("charclassmembers", []),
        rule("charclassmembers", ["charclassmembers", "charclassmember"], function(d) {
            return d[0].concat([d[1]]);
        }),

        rule("charclassmember", [ /[^\]]/ ], function(d) {
            return d[0];
        }),
        rule("charclassmember", [ "\\", /./ ], function(d) {
            return d[0] + d[1];
        }),

        rule("word", [/\w/], function(d){
            return d[0];
        }),
        rule("word", ["word", /\w/], function(d){
            return d[0]+d[1];
        }),

        rule("expr", ["word"]),
        rule("expr", ["string"]),
        rule("expr", ["expr", "whit", "word"], function(d){
            return d[0].concat([d[2]]);
        }),
        rule("expr", ["expr", "whit", "string"], function(d){
            return d[0].concat([d[2]]);
        }),

        rule("expr", ["charclass"]),
        rule("expr", ["expr", "whit", "charclass"], function(d) {
            return d[0].concat([d[2]]);
        }),

        rule("completeexpression", ["expr"], function(d) {
            return {tokens: d[0]};
        }),

        rule("completeexpression", ["expr", "whit?", "js"], function(d) {
            return {tokens: d[0], postprocessor: d[2]};
        }),

        rule("expression+", ["completeexpression"]),
        rule("expression+", ["expression+", "whit?", m("|"), "whit?", "completeexpression"], function(d) {
            return d[0].concat([d[4]]);
        }),

        rule("prod", ["word", "whit?", m("-"), m(">"), "whit?", "expression+"], function(d) {
            return {name: d[0], rules: d[5]};
        }),

        rule("prog", ["prod"], function(d) {
            return [d[0]];
        }),

        rule("prog", ["prod", "whit", "prog"], function(d) {
            return [d[0]].concat(d[2]);
        }),

        rule("final", ["whit?", "prog", "whit?"], function(d) {
            return d[1];
        })
    ],
    start: "final"
}
