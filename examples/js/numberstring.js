// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


var nameMap = {
    one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
    ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,
    twenty:20,thirty:30,fourty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,
    hundred:100,thousand:1000,million:1000000,billion:1000000000
};

var nameToVal = function(d) {
    return nameMap[d];
};

var nothing = function (d) {
    return null;
};

var sumParts = function(d) {
    var retVal = 0;
    for(var i=0;i<d.length;i++) {
        var curVal = d[i];
        if(curVal!==null&&!isNaN(curVal)) {
            retVal = retVal+parseInt(curVal);
        }
    }
    return retVal;
};

var multParts = function(d) {
    var retVal = 1;
    for(var i=0;i<d.length;i++) {
        var curVal = d[i];
        if(curVal!==null&&!isNaN(curVal)) {
            retVal = retVal*parseInt(curVal);
        }
    }
    return retVal;
};

var findFirstNestedValueFromArray = function(d) {
    if(d instanceof Array) return findFirstNestedValueFromArray(d[0]);
    return d;
};
var grammar = {
    ParserRules: [
    {"name": "main", "symbols": ["billionsNumber"], "postprocess": findFirstNestedValueFromArray},
    {"name": "billionsNumber", "symbols": ["billionsSimple"]},
    {"name": "billionsNumber", "symbols": ["billionsCompound"]},
    {"name": "billionsNumber", "symbols": ["millionsNumber"]},
    {"name": "millionsNumber", "symbols": ["millionsSimple"]},
    {"name": "millionsNumber", "symbols": ["millionsCompound"]},
    {"name": "millionsNumber", "symbols": ["thousandsNumber"]},
    {"name": "thousandsNumber", "symbols": ["thousandsSimple"]},
    {"name": "thousandsNumber", "symbols": ["thousandsCompound"]},
    {"name": "thousandsNumber", "symbols": ["hundredsNumber"]},
    {"name": "hundredsNumber", "symbols": ["hundredsSimple"]},
    {"name": "hundredsNumber", "symbols": ["hundredsCompound"]},
    {"name": "hundredsNumber", "symbols": ["tensNumber"]},
    {"name": "tensNumber", "symbols": ["teenSimple"]},
    {"name": "tensNumber", "symbols": ["tensSimple"]},
    {"name": "tensNumber", "symbols": ["tensCompound"]},
    {"name": "tensNumber", "symbols": ["singlesSimple"]},
    {"name": "billionsCompound", "symbols": ["billionsSimple", "space", "billionsNumber"], "postprocess": sumParts},
    {"name": "millionsCompound", "symbols": ["millionsSimple", "space", "millionsNumber"], "postprocess": sumParts},
    {"name": "thousandsCompound", "symbols": ["thousandsSimple", "space", "hundredsNumber"], "postprocess": sumParts},
    {"name": "hundredsCompound", "symbols": ["hundredsSimple", "space", "tensNumber"], "postprocess": sumParts},
    {"name": "tensCompound", "symbols": ["tensSimple", "space", "singlesSimple"], "postprocess": sumParts},
    {"name": "billionsSimple$macrocall$2$string$1", "symbols": [{"literal":"b"}, {"literal":"i"}, {"literal":"l"}, {"literal":"l"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "billionsSimple$macrocall$2", "symbols": ["billionsSimple$macrocall$2$string$1"]},
    {"name": "billionsSimple$macrocall$1", "symbols": ["billionsSimple$macrocall$2"], "postprocess": nameToVal},
    {"name": "billionsSimple", "symbols": ["millionsNumber", "space", "billionsSimple$macrocall$1"], "postprocess": multParts},
    {"name": "millionsSimple$macrocall$2$string$1", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"l"}, {"literal":"l"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "millionsSimple$macrocall$2", "symbols": ["millionsSimple$macrocall$2$string$1"]},
    {"name": "millionsSimple$macrocall$1", "symbols": ["millionsSimple$macrocall$2"], "postprocess": nameToVal},
    {"name": "millionsSimple", "symbols": ["thousandsNumber", "space", "millionsSimple$macrocall$1"], "postprocess": multParts},
    {"name": "thousandsSimple$macrocall$2$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"s"}, {"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "thousandsSimple$macrocall$2", "symbols": ["thousandsSimple$macrocall$2$string$1"]},
    {"name": "thousandsSimple$macrocall$1", "symbols": ["thousandsSimple$macrocall$2"], "postprocess": nameToVal},
    {"name": "thousandsSimple", "symbols": ["hundredsNumber", "space", "thousandsSimple$macrocall$1"], "postprocess": multParts},
    {"name": "hundredsSimple$macrocall$2$string$1", "symbols": [{"literal":"h"}, {"literal":"u"}, {"literal":"n"}, {"literal":"d"}, {"literal":"r"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hundredsSimple$macrocall$2", "symbols": ["hundredsSimple$macrocall$2$string$1"]},
    {"name": "hundredsSimple$macrocall$1", "symbols": ["hundredsSimple$macrocall$2"], "postprocess": nameToVal},
    {"name": "hundredsSimple", "symbols": ["tensNumber", "space", "hundredsSimple$macrocall$1"], "postprocess": multParts},
    {"name": "teenSimple$subexpression$1$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$1"]},
    {"name": "teenSimple$subexpression$1$string$2", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"v"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$2"]},
    {"name": "teenSimple$subexpression$1$string$3", "symbols": [{"literal":"t"}, {"literal":"w"}, {"literal":"e"}, {"literal":"l"}, {"literal":"v"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$3"]},
    {"name": "teenSimple$subexpression$1$string$4", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"i"}, {"literal":"r"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$4"]},
    {"name": "teenSimple$subexpression$1$string$5", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"u"}, {"literal":"r"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$5"]},
    {"name": "teenSimple$subexpression$1$string$6", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"f"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$6"]},
    {"name": "teenSimple$subexpression$1$string$7", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"x"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$7"]},
    {"name": "teenSimple$subexpression$1$string$8", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"v"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$8"]},
    {"name": "teenSimple$subexpression$1$string$9", "symbols": [{"literal":"e"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$9"]},
    {"name": "teenSimple$subexpression$1$string$10", "symbols": [{"literal":"n"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"t"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "teenSimple$subexpression$1", "symbols": ["teenSimple$subexpression$1$string$10"]},
    {"name": "teenSimple", "symbols": ["teenSimple$subexpression$1"], "postprocess": nameToVal},
    {"name": "tensSimple$subexpression$1$string$1", "symbols": [{"literal":"t"}, {"literal":"w"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$1"]},
    {"name": "tensSimple$subexpression$1$string$2", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"i"}, {"literal":"r"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$2"]},
    {"name": "tensSimple$subexpression$1$string$3", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"u"}, {"literal":"r"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$3"]},
    {"name": "tensSimple$subexpression$1$string$4", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"f"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$4"]},
    {"name": "tensSimple$subexpression$1$string$5", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"x"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$5"]},
    {"name": "tensSimple$subexpression$1$string$6", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"v"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$6"]},
    {"name": "tensSimple$subexpression$1$string$7", "symbols": [{"literal":"e"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$7"]},
    {"name": "tensSimple$subexpression$1$string$8", "symbols": [{"literal":"n"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "tensSimple$subexpression$1", "symbols": ["tensSimple$subexpression$1$string$8"]},
    {"name": "tensSimple", "symbols": ["tensSimple$subexpression$1"], "postprocess": nameToVal},
    {"name": "singlesSimple$subexpression$1$string$1", "symbols": [{"literal":"o"}, {"literal":"n"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$1"]},
    {"name": "singlesSimple$subexpression$1$string$2", "symbols": [{"literal":"t"}, {"literal":"w"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$2"]},
    {"name": "singlesSimple$subexpression$1$string$3", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"r"}, {"literal":"e"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$3"]},
    {"name": "singlesSimple$subexpression$1$string$4", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"u"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$4"]},
    {"name": "singlesSimple$subexpression$1$string$5", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"v"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$5"]},
    {"name": "singlesSimple$subexpression$1$string$6", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$6"]},
    {"name": "singlesSimple$subexpression$1$string$7", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"v"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$7"]},
    {"name": "singlesSimple$subexpression$1$string$8", "symbols": [{"literal":"e"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$8"]},
    {"name": "singlesSimple$subexpression$1$string$9", "symbols": [{"literal":"n"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singlesSimple$subexpression$1", "symbols": ["singlesSimple$subexpression$1$string$9"]},
    {"name": "singlesSimple", "symbols": ["singlesSimple$subexpression$1"], "postprocess": nameToVal},
    {"name": "space", "symbols": [/[\s]/], "postprocess": nothing}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
