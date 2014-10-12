// Since nearley is now bootstrapped, this file isn't used.
// I'm going to keep it around, though, as a reference for
// the raw JS nearley API. It's also going to help out in
// case we ever break the compiler and need sources to un-
// break it.
//
//      --h

var NullPP = function(argument) {return null;}

function rule(name, symbols, proc) {
    return { name: name, symbols: symbols, postprocess: proc };
}

function m(s) {
    return { literal: s };
}
module.exports = {
    rules: [
        // Literally a string of whitespace
        rule("whitraw", [/\s/], NullPP),
        rule("whitraw", ["whitraw", /\s/], NullPP),
        
        // A string of whitespace OR the empty string
        rule("whitraw?", [], NullPP),
        rule("whitraw?", ["whitraw"], NullPP),
        
        // Whitespace with a comment
        rule("whit", ["whitraw"], NullPP),
        rule("whit", ["whitraw?", "comment", "whit?"], NullPP),
        
        // Optional whitespace with a comment
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
            return { literal: d[1].join("") };
        }),
        rule("charset", []),
        rule("charset", ["charset", "char"], function(d) {
            return d[0].concat([d[1]]);
        }),
        rule("char", [ new RegExp("[^ \\\\ \"]")], function(d) {
            return d[0];
        }),
        rule("char", [ m("\\"), new RegExp(".") ], function(d) {
            return JSON.parse("\""+"\\"+d[1]+"\"");
        }),

        rule("charclass", [m(".")], function(d) {
            return new RegExp(d[0]);
        }),

        rule("charclass", [m("["), "charclassmembers", m("]")], function(d) {
            return new RegExp("[" + d[1].join('') + "]");
        }),

        rule("charclassmembers", []),
        rule("charclassmembers", ["charclassmembers", "charclassmember"], function(d) {
            return d[0].concat([d[1]]);
        }),

        rule("charclassmember", [ /[^\\\]]/ ], function(d) {
            return d[0];
        }),
        rule("charclassmember", [m("\\"), /./], function(d) {
            return d[0] + d[1];
        }),

        rule("word", [/[\w\?\+]/], function(d){
            return d[0];
        }),
        rule("word", ["word", /[\w\?\+]/], function(d){
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
            return {tokens: d[0], postprocess: d[2]};
        }),

        rule("expression+", ["completeexpression"]),
        rule("expression+", ["expression+", "whit?", m("|"), "whit?", "completeexpression"], function(d) {
            return d[0].concat([d[4]]);
        }),

        rule("prod", ["word", "whit?", m("-"), m(">"), "whit?", "expression+"], function(d) {
            return {name: d[0], rules: d[5]};
        }),

        rule("prod", [m("@"), "whit?", "js"], function(d) {
            return {body: d[2]};
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
