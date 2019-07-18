
const fs = require('fs');
const expect = require('expect');

const nearley = require('../lib/nearley');
const {compile, parse} = require('./_shared');

function read(filename) {
    return fs.readFileSync(filename, 'utf-8');
}


describe('Parser: API', function() {

    let testGrammar = compile(`
    y -> x:+
    x -> [a-z0-9] | "\\n"
    `)

    it('shows line number in errors', function() {
      expect(() => parse(testGrammar, 'abc\n12!')).toThrow(
        /line 2 col 3/
      )
    })

    it('shows token index in errors', function() {
      expect(() => parse(testGrammar, ['1', '2', '!'])).toThrow(
        /at index 2/
      )
    })

    var tosh = compile(read("examples/tosh.ne"));

    it('can save state', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)
        var col = p.save();
        expect(col.index).toBe(11)
        expect(col.lexerState.col).toBe(first.length)
    });

    it('can rewind', function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)

        p.feed(second);

        p.rewind(first.length);

        expect(p.current).toBe(11)
        expect(p.table.length).toBe(12)

        expect(p.results).toEqual([['say:', 'hello']]);
    });

    it("won't rewind without `keepHistory` option", function() {
        let p = new nearley.Parser(tosh, {});
        expect(() => p.rewind()).toThrow()
    })

    it('restores line numbers', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('abc\n')
      expect(p.save().lexerState.line).toBe(2)
      p.feed('123\n')
      var col = p.save();
      expect(col.lexerState.line).toBe(3)
      p.feed('q')
      p.restore(col);
      expect(p.lexer.line).toBe(3)
      p.feed('z')
    });

    it('restores column number', function() {
      let p = new nearley.Parser(testGrammar);
      p.feed('foo\nbar')
      var col = p.save();
      expect(col.lexerState.line).toBe(2)
      expect(col.lexerState.col).toBe(3)
      p.feed('123');
      expect(p.lexerState.col).toBe(6)

      p.restore(col);
      expect(p.lexerState.line).toBe(2)
      expect(p.lexerState.col).toBe(3)
      p.feed('456')
      expect(p.lexerState.col).toBe(6)
    });

    // TODO: moo save/restore

});

describe('Parser: examples', () => {

    it('nullable whitespace bug', function() {
        var wsb = compile(read("test/grammars/whitespace.ne"));
        expect(parse(wsb, "(x)")).toEqual(
            [ [ [ [ '(', null, [ [ [ [ 'x' ] ] ] ], null, ')' ] ] ] ]);
    });

    const parentheses = compile(read("examples/parentheses.ne"));
    it('parentheses', () => {
        var passCases = [
            '()',
            '[(){}<>]',
            '[(((<>)()({})())(()())(())[])]',
            '<<[([])]>([(<>[]{}{}<>())[{}[][]{}{}[]<>[]{}<>{}<>[]<>{}()][[][][]()()()]({})<[]>{(){}()<>}(<>[])]())({})>'
        ];

        for (let i in passCases) {
            expect(parse(parentheses, passCases[i])).toEqual([true]);
        }

        var failCases = [
            ' ',
            '[}',
            '[(){}><]',
            '(((())))(()))'
        ];

        for (let i in failCases) {
            expect(function() { parse(parentheses, failCases[i]); }).toThrow()
        }

        // These are invalid inputs but the parser will not complain
        expect(parse(parentheses, '')).toEqual([]);
        expect(parse(parentheses, '((((())))(())()')).toEqual([]);
    });

    it('tokens', function() {
        var tokc = compile(read("examples/token.ne"));
        expect(parse(tokc, [123, 456, " ", 789])).toEqual([ [123, [ [ 456, " ", 789 ] ]] ]);
    });

    const json = compile(read("examples/json.ne"));
    it('json', () => {
        const test1 = '{ "a" : true, "b" : "䕧⡱a\\\\\\"b\\u4567\\u2871䕧⡱\\t\\r\\f\\b\\n", "c" : null, "d" : [null, true, false, null] }\n'
        expect(parse(json, test1)).toEqual([JSON.parse(test1)])

        const test2 = '{ "a" : true, "b" : "䕧⡱a\\\\\\"b\\u4567\\u2871䕧⡱\\t\\r\\f\\b\\n\\u0010\\u001f\\u005b\\u005c\\u005d", "c" : null, "d" : [null, true, false, -0.2345E+10] }\n'
        expect(parse(json, test2)).toEqual([JSON.parse(test2)])
    });

    it('tosh', () => {
        var tosh = compile(read("examples/tosh.ne"));
        expect(parse(tosh, "set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))"))
            .toEqual([["setVar:to:","foo",["*",["*",2,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]],["-",1,["computeFunction:of:","e ^",["+",["*",["readVariable","foo"],-0.05],0.5]]]]]]);
    })

})

