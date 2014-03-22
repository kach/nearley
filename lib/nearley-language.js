var nearley = require('./nearley.js');

var NullPP = function(argument) {return null;}

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
        nearley.rule(WS, [/\s/], NullPP),
        nearley.rule(WS, [WS, /\s/], NullPP),
        nearley.rule(OptionalWS, [], NullPP),
        nearley.rule(OptionalWS, [WS], NullPP),

        nearley.rule(JS, ["{", "%", JSCode, "%", "}"], function(d) {
            return d[2];
        }),
        nearley.rule(JSCode, [], function() {return "";}),
        nearley.rule(JSCode, [JSCode, /[^%]/], function(d) {return d[0] + d[1];}),

        nearley.rule(StringLiteral, ["\"", Charset,"\""], function(d) {
            return {"type":"literal", "data":d[1].join("")};
        }),
        nearley.rule(Charset, []),
        nearley.rule(Charset, [Charset, Char], function(d) {
            return d[0].concat([d[1]]);
        }),
        nearley.rule(Char, [ new RegExp("[^\"]")], function(d) {
            return d[0];
        }),
        nearley.rule(Char, [ "\\", new RegExp(".") ], function(d) {
            return JSON.parse("\""+"\\"+d[1]+"\"");
        }),

        nearley.rule(Word, [/\w/], function(d){
            return d[0];
        }),
        nearley.rule(Word, [Word, /\w/], function(d){
            return d[0]+d[1];
        }),
        nearley.rule(Word, [StringLiteral], function(d) {
            return d[0];
        }),

        nearley.rule(Expression, [Word]),
        nearley.rule(Expression, [Expression, WS, Word], function(d){
            return d[0].concat([d[2]]);
        }),

        nearley.rule(CompleteExpression, [Expression], function(d) {
            return {tokens: d[0]};
        }),

        nearley.rule(CompleteExpression, [Expression, OptionalWS, JS], function(d) {
            return {tokens: d[0], postprocessor: d[2]};
        }),

        nearley.rule(ExpressionList, [CompleteExpression]),
        nearley.rule(ExpressionList, [ExpressionList, OptionalWS, "|", OptionalWS, CompleteExpression], function(d) {
            return d[0].concat([d[4]]);
        }),

        nearley.rule(ProductionRule, [Word, OptionalWS, "-", ">", OptionalWS, ExpressionList], function(d) {
            return {name: d[0], rules: d[5]};
        }),

        nearley.rule(Prog, [ProductionRule], function(d) {
            return [d[0]];
        }),

        nearley.rule(Prog, [ProductionRule, WS, Prog], function(d) {
            return [d[0]].concat(d[2]);
        }),
        nearley.rule(Prog, [Prog, OptionalWS], function(d) {
            return d[0];
        }),
    ],
    start: Prog
}
