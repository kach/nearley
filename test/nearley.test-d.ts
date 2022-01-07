import { Parser, ParserOptions, Rule, Grammar, CompiledRules, ParserRule, Lexer, LexerState, Postprocessor } from '..';
import { expectType } from 'tsd';

declare const compiledRules: CompiledRules;
declare const lexer: Lexer;

expectType<Lexer | undefined>(compiledRules.Lexer);
expectType<string>(compiledRules.ParserStart);
expectType<ParserRule[]>(compiledRules.ParserRules);
expectType<string>(compiledRules.ParserRules[0].name);
expectType<any[]>(compiledRules.ParserRules[0].symbols);
expectType<Postprocessor | undefined>(compiledRules.ParserRules[0].postprocess);

lexer.reset('');
lexer.reset('', {});
expectType<string | { value: string; } | undefined>(lexer.next());
expectType<LexerState>(lexer.save());
expectType<string>(lexer.formatError('', ''));
lexer.formatError({value: ''}, '');

const rule = new Rule(compiledRules.ParserRules[0].name, compiledRules.ParserRules[0].symbols, compiledRules.ParserRules[0].postprocess);

expectType<number>(rule.id);
expectType<string>(rule.name);
expectType<any[]>(rule.symbols);
expectType<Postprocessor | undefined>(rule.postprocess);

expectType<string>(rule.toString());
rule.toString(1);

expectType<Grammar>(Grammar.fromCompiled(compiledRules));
const grammar = new Grammar([rule]);

expectType<Rule[]>(grammar.rules);
expectType<string>(grammar.start);
expectType<{ [ruleName: string]: Rule[]; }>(grammar.byName);
expectType<Lexer | undefined>(grammar.lexer);

expectType<{}>(Parser.fail);

const parser = new Parser(grammar);
new Parser(grammar, {lexer});
new Parser(grammar, {keepHistory: false});

expectType<Grammar>(parser.grammar);
expectType<ParserOptions>(parser.options);
expectType<Lexer>(parser.lexer);
expectType<LexerState | undefined>(parser.lexerState);
expectType<number>(parser.current);
expectType<any[]>(parser.results);

expectType<Parser>(parser.feed(''));
expectType<any[]>(parser.finish());
const state = parser.save();
expectType<{ [key: string]: any; lexerState: LexerState; }>(state);
parser.restore(state);

try {
    parser.feed("<123>");
    if (parser.results) {
        console.log(parser.results[0]);
    }
} catch (error) {
    console.log(error);
}
