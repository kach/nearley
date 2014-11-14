// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "Chunk", "symbols": ["_", "Block", "_"]},
    {"name": "Block", "symbols": ["_Block"]},
    {"name": "Block", "symbols": ["_Block", "__", "ReturnStat"]},
    {"name": " string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStat", "symbols": [" string$1", "__", "ExpList"]},
    {"name": " string$2", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStat", "symbols": [" string$2", "__", "ExpList", "_", {"literal":";"}]},
    {"name": "_Block", "symbols": ["Statement"]},
    {"name": "_Block", "symbols": ["_Block", "_", {"literal":";"}, "_", "Statement"]},
    {"name": "_Block", "symbols": ["_Block", "__", "Statement"]},
    {"name": "Statement", "symbols": ["VarList", "_", {"literal":"="}, "_", "ExpList"]},
    {"name": "Statement", "symbols": ["FunctionCall"]},
    {"name": "Statement", "symbols": ["Label"]},
    {"name": " string$3", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$3"]},
    {"name": " string$4", "symbols": [{"literal":"g"}, {"literal":"o"}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$4", "__", "Name"]},
    {"name": " string$5", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$6", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$5", "__", "Block", "__", " string$6"]},
    {"name": " string$7", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$8", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$9", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$7", "__", "Exp", "__", " string$8", "__", "Block", "__", " string$9"]},
    {"name": " string$10", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"p"}, {"literal":"e"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$11", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$10", "__", "Block", "__", " string$11", "__", "Exp"]},
    {"name": " string$12", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$13", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$12", "__", "Exp", "__", " string$13", "__", "Block", "__", "Else"]},
    {"name": " string$14", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$15", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$16", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$17", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$14", "__", "NameList", "__", " string$15", "__", "ExpList", "__", " string$16", "__", "Block", "__", " string$17"]},
    {"name": " string$18", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$18", "__", "FunctionName", "_", "FunctionBody"]},
    {"name": " string$19", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$20", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$19", "__", " string$20", "__", "Name", "__", "FunctionBody"]},
    {"name": " string$21", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$21", "__", "NameList"]},
    {"name": " string$22", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": [" string$22", "__", "NameList", "_", {"literal":"="}, "_", "ExpList"]},
    {"name": " string$23", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": [" string$23"]},
    {"name": " string$24", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": ["_Else", "__", " string$24"]},
    {"name": " string$25", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$26", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": ["_Else", "__", " string$25", "__", "Block", "__", " string$26"]},
    {"name": " string$27", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$28", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else", "symbols": [" string$27", "__", "Exp", "__", " string$28", "__", "Block"]},
    {"name": " string$29", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$30", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else", "symbols": ["_Else", "__", " string$29", "__", "Exp", "__", " string$30", "__", "Block"]},
    {"name": " string$31", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": " string$32", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Label", "symbols": [" string$31", "_", "Name", "_", " string$32"]},
    {"name": "Name", "symbols": ["_name"], "postprocess":  function(d) {return {'name': d[0]}; } },
    {"name": "_name", "symbols": [/[a-zA-Z_]/], "postprocess":  id },
    {"name": "_name", "symbols": ["_name", /[\w_]/], "postprocess":  function(d) {return d[0] + d[1]; } },
    {"name": "NameList", "symbols": ["Name"]},
    {"name": "NameList", "symbols": ["NameList", "_", {"literal":","}, "_", "Name"]},
    {"name": "Var", "symbols": ["Name"]},
    {"name": "Var", "symbols": ["PrefixExp", "_", {"literal":"["}, "_", "Exp", "_", {"literal":"]"}]},
    {"name": "Var", "symbols": ["PrefixExp", "_", {"literal":"."}, "_", "Name"]},
    {"name": "VarList", "symbols": ["Var"]},
    {"name": "VarList", "symbols": ["VarList", "_", {"literal":","}, "_", "Var"]},
    {"name": "ExpList", "symbols": ["Exp"]},
    {"name": "ExpList", "symbols": ["ExpList", "_", {"literal":","}, "_", "Exp"]},
    {"name": "PrefixExp", "symbols": ["Var"]},
    {"name": "PrefixExp", "symbols": ["FunctionCall"]},
    {"name": "PrefixExp", "symbols": ["Parenthesized"]},
    {"name": "FunctionCall", "symbols": ["PrefixExp", "_", "Args"]},
    {"name": "FunctionCall", "symbols": ["PrefixExp", "_", {"literal":":"}, "_", "Name", "_", "Args"]},
    {"name": "Args", "symbols": [{"literal":"("}, "_", {"literal":")"}]},
    {"name": "Args", "symbols": [{"literal":"("}, "_", "ExpList", "_", {"literal":")"}]},
    {"name": "Args", "symbols": ["String"]},
    {"name": "FunctionName", "symbols": ["_functionname"]},
    {"name": "FunctionName", "symbols": ["_functionname", {"literal":":"}, "Name"]},
    {"name": "_functionname", "symbols": ["Name"]},
    {"name": "_functionname", "symbols": ["FunctionName", "_", {"literal":"."}, "_", "FunctionName"]},
    {"name": " string$33", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionDef", "symbols": [" string$33", "__", "FunctionBody"]},
    {"name": " string$34", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionBody", "symbols": [{"literal":"("}, "_", "ParamList", "_", {"literal":")"}, "__", "Block", "__", " string$34"]},
    {"name": " string$35", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionBody", "symbols": [{"literal":"("}, "_", {"literal":")"}, "__", "Block", "__", " string$35"]},
    {"name": "ParamList", "symbols": ["NameList"]},
    {"name": " string$36", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ParamList", "symbols": ["NameList", "_", {"literal":","}, "_", " string$36"]},
    {"name": " string$37", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ParamList", "symbols": [" string$37"]},
    {"name": "TableConstructor", "symbols": [{"literal":"{"}, "_", "FieldList", "_", {"literal":"}"}]},
    {"name": "TableConstructor", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "FieldList", "symbols": ["_FieldList"]},
    {"name": "FieldList", "symbols": ["_FieldList", "_", "FieldSep"]},
    {"name": "_FieldList", "symbols": ["Field"]},
    {"name": "_FieldList", "symbols": ["_FieldList", "_", "FieldSep", "_", "Field"]},
    {"name": "Field", "symbols": [{"literal":"["}, "_", "Exp", "_", {"literal":"]"}, "_", {"literal":"="}, "_", "Exp"]},
    {"name": "Field", "symbols": ["Name", "_", {"literal":"="}, "_", "Exp"]},
    {"name": "Field", "symbols": ["Exp"]},
    {"name": "FieldSep", "symbols": [{"literal":","}]},
    {"name": "FieldSep", "symbols": [{"literal":";"}]},
    {"name": "Exp", "symbols": ["Binop"], "postprocess":  id },
    {"name": "Binop", "symbols": ["ExpOr"], "postprocess":  id },
    {"name": "Parenthesized", "symbols": [{"literal":"("}, "Exp", {"literal":")"}]},
    {"name": " string$38", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpOr", "symbols": ["ExpOr", "__", " string$38", "__", "ExpAnd"]},
    {"name": "ExpOr", "symbols": ["ExpAnd"], "postprocess":  id },
    {"name": " string$39", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpAnd", "symbols": ["ExpAnd", "__", " string$39", "__", "ExpComparison"]},
    {"name": "ExpAnd", "symbols": ["ExpComparison"], "postprocess":  id },
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", {"literal":"<"}, "_", "ExpConcatenation"]},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", {"literal":">"}, "_", "ExpConcatenation"]},
    {"name": " string$40", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", " string$40", "_", "ExpConcatenation"]},
    {"name": " string$41", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", " string$41", "_", "ExpConcatenation"]},
    {"name": " string$42", "symbols": [{"literal":"~"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", " string$42", "_", "ExpConcatenation"]},
    {"name": " string$43", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", " string$43", "_", "ExpConcatenation"]},
    {"name": "ExpComparison", "symbols": ["ExpConcatenation"]},
    {"name": " string$44", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpConcatenation", "symbols": ["ExpSum", "_", " string$44", "_", "ExpConcatenation"]},
    {"name": "ExpConcatenation", "symbols": ["ExpSum"]},
    {"name": "ExpSum", "symbols": ["ExpSum", "_", {"literal":"+"}, "_", "ExpProduct"]},
    {"name": "ExpSum", "symbols": ["ExpSum", "_", {"literal":"-"}, "_", "ExpProduct"]},
    {"name": "ExpSum", "symbols": ["ExpProduct"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"*"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"/"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"%"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpUnary"]},
    {"name": " string$45", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpUnary", "symbols": [" string$45", "__", "ExpPow"]},
    {"name": "ExpUnary", "symbols": [{"literal":"#"}, "_", "ExpPow"]},
    {"name": "ExpUnary", "symbols": [{"literal":"-"}, "_", "ExpPow"]},
    {"name": "ExpUnary", "symbols": ["ExpPow"]},
    {"name": "ExpPow", "symbols": ["Atom"]},
    {"name": "ExpPow", "symbols": ["Atom", "_", {"literal":"^"}, "_", "ExpPow"]},
    {"name": "Atom", "symbols": ["Number"]},
    {"name": "Atom", "symbols": ["String"]},
    {"name": "Atom", "symbols": ["PrefixExp"]},
    {"name": " string$46", "symbols": [{"literal":"n"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": [" string$46"]},
    {"name": " string$47", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": [" string$47"]},
    {"name": " string$48", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": [" string$48"]},
    {"name": "Atom", "symbols": ["Parenthesized"]},
    {"name": "Atom", "symbols": ["FunctionDef"]},
    {"name": "Atom", "symbols": ["TableConstructor"]},
    {"name": "Number", "symbols": ["_number"], "postprocess":  function(d) {return {'literal': parseFloat(d[0])}} },
    {"name": "_posint", "symbols": [/[0-9]/], "postprocess":  id },
    {"name": "_posint", "symbols": ["_posint", /[0-9]/], "postprocess":  function(d) {return d[0] + d[1]} },
    {"name": "_int", "symbols": [{"literal":"-"}, "_posint"], "postprocess":  function(d) {return d[0] + d[1]; }},
    {"name": "_int", "symbols": ["_posint"], "postprocess":  id },
    {"name": "_float", "symbols": ["_int"], "postprocess":  id },
    {"name": "_float", "symbols": ["_int", {"literal":"."}, "_posint"], "postprocess":  function(d) {return d[0] + d[1] + d[2]; }},
    {"name": "_number", "symbols": ["_float"], "postprocess":  id },
    {"name": "_number", "symbols": ["_float", {"literal":"e"}, "_int"], "postprocess":  function(d){return d[0] + d[1] + d[2]; } },
    {"name": "String", "symbols": [{"literal":"\""}, "_string", {"literal":"\""}], "postprocess":  function(d) {return {'literal':d[1]}; } },
    {"name": "_string", "symbols": [], "postprocess":  function() {return ""; } },
    {"name": "_string", "symbols": ["_string", "_stringchar"], "postprocess":  function(d) {return d[0] + d[1];} },
    {"name": "_stringchar", "symbols": [/[^\\"]/], "postprocess":  id },
    {"name": "_stringchar", "symbols": [{"literal":"\\"}, /[^]/], "postprocess":  function(d) {return JSON.parse("\"" + d[0] + d[1] + "\""); } },
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["_", /[\s]/], "postprocess":  function() {} },
    {"name": "__", "symbols": [/[\s]/]},
    {"name": "__", "symbols": ["__", /[\s]/], "postprocess":  function() {} }
]
  , ParserStart: "Chunk"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
