var NullPP = function(argument) {return null;}

function rule(name, symbols, proc) {
    return { name: name, symbols: symbols, postprocess: proc };
}

var Word = ["word"],
    WS = ["whit"],
    OptionalWS = ["whit?"],
    ProductionRule = ["prod"],
    Expression = ["expr"],
    CompleteExpression = ["cexpr"],
    ExpressionList = ["list"],
    Prog = ["prog"],
    StringLiteral = ["strlit"],
    Charset = ["charset"],
    Char = ["char"],
    JS = ["js"],
    JSCode = ["jscode"];

module.exports = {
    rules: [
        rule(WS, [/\s/], NullPP),
        rule(WS, [WS, /\s/], NullPP),
        rule(OptionalWS, [], NullPP),
        rule(OptionalWS, [WS], NullPP),

        rule(JS, ["{", "%", JSCode, "%", "}"], function(d) {
            return d[2];
        }),
        rule(JSCode, [], function() {return "";}),
        rule(JSCode, [JSCode, /[^%]/], function(d) {return d[0] + d[1];}),

        rule(StringLiteral, ["\"", Charset,"\""], function(d) {
            return {"type":"literal", "data":d[1].join("")};
        }),
        rule(Charset, []),
        rule(Charset, [Charset, Char], function(d) {
            return d[0].concat([d[1]]);
        }),
        rule(Char, [ new RegExp("[^\"]")], function(d) {
            return d[0];
        }),
        rule(Char, [ "\\", new RegExp(".") ], function(d) {
            return JSON.parse("\""+"\\"+d[1]+"\"");
        }),

        rule(Word, [/\w/], function(d){
            return d[0];
        }),
        rule(Word, [Word, /\w/], function(d){
            return d[0]+d[1];
        }),
        rule(Word, [StringLiteral], function(d) {
            return d[0];
        }),

        rule(Expression, [Word]),
        rule(Expression, [Expression, WS, Word], function(d){
            return d[0].concat([d[2]]);
        }),

        rule(CompleteExpression, [Expression], function(d) {
            return {tokens: d[0]};
        }),

        rule(CompleteExpression, [Expression, OptionalWS, JS], function(d) {
            return {tokens: d[0], postprocessor: d[2]};
        }),

        rule(ExpressionList, [CompleteExpression]),
        rule(ExpressionList, [ExpressionList, OptionalWS, "|", OptionalWS, CompleteExpression], function(d) {
            return d[0].concat([d[4]]);
        }),

        rule(ProductionRule, [Word, OptionalWS, "-", ">", OptionalWS, ExpressionList], function(d) {
            return {name: d[0], rules: d[5]};
        }),

        rule(Prog, [ProductionRule], function(d) {
            return [d[0]];
        }),

        rule(Prog, [ProductionRule, WS, Prog], function(d) {
            return [d[0]].concat(d[2]);
        }),
        rule(Prog, [Prog, OptionalWS], function(d) {
            return d[0];
        }),
    ],
    start: Prog
}
