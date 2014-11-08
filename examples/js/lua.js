// Generated automatically by nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "Chunk", "symbols": ["_", "Block", "_"]},
    {"name": "Block", "symbols": ["_Block"]},
    {"name": "Block", "symbols": ["_Block", "__", "ReturnStat"]},
    {"name": "ReturnStat$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStat", "symbols": ["ReturnStat$1", "__", "ExpList"]},
    {"name": "ReturnStat$2", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ReturnStat", "symbols": ["ReturnStat$2", "__", "ExpList", "_", {"literal":";"}]},
    {"name": "_Block", "symbols": ["Statement"]},
    {"name": "_Block", "symbols": ["_Block", "_", {"literal":";"}, "_", "Statement"]},
    {"name": "_Block", "symbols": ["_Block", "__", "Statement"]},
    {"name": "Statement", "symbols": ["VarList", "_", {"literal":"="}, "_", "ExpList"]},
    {"name": "Statement", "symbols": ["FunctionCall"]},
    {"name": "Statement", "symbols": ["Label"]},
    {"name": "Statement$3", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$3"]},
    {"name": "Statement$4", "symbols": [{"literal":"g"}, {"literal":"o"}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$4", "__", "Name"]},
    {"name": "Statement$5", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$6", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$5", "__", "Block", "__", "Statement$6"]},
    {"name": "Statement$7", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$8", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$9", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$7", "__", "Exp", "__", "Statement$8", "__", "Block", "__", "Statement$9"]},
    {"name": "Statement$10", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"p"}, {"literal":"e"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$11", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$10", "__", "Block", "__", "Statement$11", "__", "Exp"]},
    {"name": "Statement$12", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$13", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$12", "__", "Exp", "__", "Statement$13", "__", "Block", "__", "Else"]},
    {"name": "Statement$14", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$15", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$16", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$17", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$14", "__", "NameList", "__", "Statement$15", "__", "ExpList", "__", "Statement$16", "__", "Block", "__", "Statement$17"]},
    {"name": "Statement$18", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$18", "__", "FunctionName", "_", "FunctionBody"]},
    {"name": "Statement$19", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement$20", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$19", "__", "Statement$20", "__", "Name", "__", "FunctionBody"]},
    {"name": "Statement$21", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$21", "__", "NameList"]},
    {"name": "Statement$22", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"c"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Statement", "symbols": ["Statement$22", "__", "NameList", "_", {"literal":"="}, "_", "ExpList"]},
    {"name": "Else$23", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": ["Else$23"]},
    {"name": "Else$24", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": ["_Else", "__", "Else$24"]},
    {"name": "Else$25", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else$26", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Else", "symbols": ["_Else", "__", "Else$25", "__", "Block", "__", "Else$26"]},
    {"name": "_Else$27", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else$28", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else", "symbols": ["_Else$27", "__", "Exp", "__", "_Else$28", "__", "Block"]},
    {"name": "_Else$29", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else$30", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "_Else", "symbols": ["_Else", "__", "_Else$29", "__", "Exp", "__", "_Else$30", "__", "Block"]},
    {"name": "Label$31", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Label$32", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Label", "symbols": ["Label$31", "_", "Name", "_", "Label$32"]},
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
    {"name": "FunctionDef$33", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionDef", "symbols": ["FunctionDef$33", "__", "FunctionBody"]},
    {"name": "FunctionBody$34", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionBody", "symbols": [{"literal":"("}, "_", "ParamList", "_", {"literal":")"}, "__", "Block", "__", "FunctionBody$34"]},
    {"name": "FunctionBody$35", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "FunctionBody", "symbols": [{"literal":"("}, "_", {"literal":")"}, "__", "Block", "__", "FunctionBody$35"]},
    {"name": "ParamList", "symbols": ["NameList"]},
    {"name": "ParamList$36", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ParamList", "symbols": ["NameList", "_", {"literal":","}, "_", "ParamList$36"]},
    {"name": "ParamList$37", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ParamList", "symbols": ["ParamList$37"]},
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
    {"name": "ExpOr$38", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpOr", "symbols": ["ExpOr", "__", "ExpOr$38", "__", "ExpAnd"]},
    {"name": "ExpOr", "symbols": ["ExpAnd"], "postprocess":  id },
    {"name": "ExpAnd$39", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpAnd", "symbols": ["ExpAnd", "__", "ExpAnd$39", "__", "ExpComparison"]},
    {"name": "ExpAnd", "symbols": ["ExpComparison"], "postprocess":  id },
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", {"literal":"<"}, "_", "ExpConcatenation"]},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", {"literal":">"}, "_", "ExpConcatenation"]},
    {"name": "ExpComparison$40", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", "ExpComparison$40", "_", "ExpConcatenation"]},
    {"name": "ExpComparison$41", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", "ExpComparison$41", "_", "ExpConcatenation"]},
    {"name": "ExpComparison$42", "symbols": [{"literal":"~"}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", "ExpComparison$42", "_", "ExpConcatenation"]},
    {"name": "ExpComparison$43", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", "ExpComparison$43", "_", "ExpConcatenation"]},
    {"name": "ExpComparison", "symbols": ["ExpConcatenation"]},
    {"name": "ExpConcatenation$44", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpConcatenation", "symbols": ["ExpSum", "_", "ExpConcatenation$44", "_", "ExpConcatenation"]},
    {"name": "ExpConcatenation", "symbols": ["ExpSum"]},
    {"name": "ExpSum", "symbols": ["ExpSum", "_", {"literal":"+"}, "_", "ExpProduct"]},
    {"name": "ExpSum", "symbols": ["ExpSum", "_", {"literal":"-"}, "_", "ExpProduct"]},
    {"name": "ExpSum", "symbols": ["ExpProduct"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"*"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"/"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpProduct", "_", {"literal":"%"}, "_", "ExpUnary"]},
    {"name": "ExpProduct", "symbols": ["ExpUnary"]},
    {"name": "ExpUnary$45", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "ExpUnary", "symbols": ["ExpUnary$45", "__", "ExpPow"]},
    {"name": "ExpUnary", "symbols": [{"literal":"#"}, "_", "ExpPow"]},
    {"name": "ExpUnary", "symbols": [{"literal":"-"}, "_", "ExpPow"]},
    {"name": "ExpUnary", "symbols": ["ExpPow"]},
    {"name": "ExpPow", "symbols": ["Atom"]},
    {"name": "ExpPow", "symbols": ["Atom", "_", {"literal":"^"}, "_", "ExpPow"]},
    {"name": "Atom", "symbols": ["Number"]},
    {"name": "Atom", "symbols": ["String"]},
    {"name": "Atom", "symbols": ["PrefixExp"]},
    {"name": "Atom$46", "symbols": [{"literal":"n"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": ["Atom$46"]},
    {"name": "Atom$47", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": ["Atom$47"]},
    {"name": "Atom$48", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {
        return d.join('');
    }},
    {"name": "Atom", "symbols": ["Atom$48"]},
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
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
