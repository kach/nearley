// Since nearley is now bootstrapped, this file isn't used.
// I'm going to keep it around, though, as a reference for
// the raw JS nearley API. It's also going to help out in
// case we ever break the compiler and need sources to un-
// break it.
//
//      --h

var NullPP = argument => null

function rule(name, symbols, proc) {
    return { name, symbols, postprocess: proc };
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

        rule("js", [m("{"), m("%"), "jscode", m("%"), m("}")], d => d[2]),
        rule("jscode", [], () => ""),
        rule("jscode", ["jscode", /[^%]/], d => d[0] + d[1]),

        rule("string", [m("\""), "charset", m("\"")], d => ({ literal: d[1].join("") })),
        rule("charset", []),
        rule("charset", ["charset", "char"], d => d[0].concat([d[1]])),
        rule("char", [ new RegExp("[^ \\\\ \"]")], d => d[0]),
        rule("char", [ m("\\"), new RegExp(".") ], d => JSON.parse("\""+"\\"+d[1]+"\"")),

        rule("charclass", [m(".")], d => new RegExp(d[0])),

        rule("charclass", [m("["), "charclassmembers", m("]")], d => new RegExp("[" + d[1].join('') + "]")),

        rule("charclassmembers", []),
        rule("charclassmembers", ["charclassmembers", "charclassmember"], d => d[0].concat([d[1]])),

        rule("charclassmember", [ /[^\\\]]/ ], d => d[0]),
        rule("charclassmember", [m("\\"), /./], d => d[0] + d[1]),

        rule("word", [/[\w\?\+]/], d => d[0]),
        rule("word", ["word", /[\w\?\+]/], d => d[0]+d[1]),

        rule("expr", ["word"]),
        rule("expr", ["string"]),
        rule("expr", ["expr", "whit", "word"], d => d[0].concat([d[2]])),
        rule("expr", ["expr", "whit", "string"], d => d[0].concat([d[2]])),

        rule("expr", ["charclass"]),
        rule("expr", ["expr", "whit", "charclass"], d => d[0].concat([d[2]])),

        rule("completeexpression", ["expr"], d => ({tokens: d[0]})),

        rule("completeexpression", ["expr", "whit?", "js"], d => ({tokens: d[0], postprocess: d[2]})),

        rule("expression+", ["completeexpression"]),
        rule("expression+", ["expression+", "whit?", m("|"), "whit?", "completeexpression"], d => d[0].concat([d[4]])),

        rule("prod", ["word", "whit?", m("-"), m(">"), "whit?", "expression+"], d => ({name: d[0], rules: d[5]})),

        rule("prod", [m("@"), "whit?", "js"], d => ({body: d[2]})),

        rule("prog", ["prod"], d => [d[0]]),

        rule("prog", ["prod", "whit", "prog"], d => [d[0]].concat(d[2])),

        rule("final", ["whit?", "prog", "whit?"], d => d[1])
    ],
    start: "final"
}
