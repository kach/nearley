const fs = require("fs");
const expect = require("expect");

const nearley = require("../lib/nearley");
const { compile, evalGrammar, parse } = require("./_shared");

function read(filename) {
    return fs.readFileSync(filename, "utf-8");
}

describe("Parser", function() {
    let testGrammar = compile(`
    y -> x:+
    x -> [a-z0-9] | "\\n"
    `);

    it("shows line number in errors", function() {
        expect(() => parse(testGrammar, "abc\n12!")).toThrow(
            "invalid syntax at line 2 col 3:\n" + "\n" + "  12!\n" + "    ^"
        );
    });

    it("shows token index in errors", function() {
        expect(() => parse(testGrammar, ["1", "2", "!"])).toThrow(
            "invalid syntax at index 2"
        );
    });

    var tosh = compile(read("examples/tosh.ne"));

    it("can save state", function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11);
        expect(p.table.length).toBe(12);
        var col = p.save();
        expect(col.index).toBe(11);
        expect(col.lexerState.col).toBe(first.length);
    });

    it("can rewind", function() {
        let first = "say 'hello'";
        let second = " for 2 secs";
        let p = new nearley.Parser(tosh, { keepHistory: true });
        p.feed(first);
        expect(p.current).toBe(11);
        expect(p.table.length).toBe(12);

        p.feed(second);

        p.rewind(first.length);

        expect(p.current).toBe(11);
        expect(p.table.length).toBe(12);

        expect(p.results).toEqual([["say:", "hello"]]);
    });

    it("won't rewind without `keepHistory` option", function() {
        let p = new nearley.Parser(tosh, {});
        expect(() => p.rewind()).toThrow();
    });

    it("restores line numbers", function() {
        let p = new nearley.Parser(testGrammar);
        p.feed("abc\n");
        expect(p.save().lexerState.line).toBe(2);
        p.feed("123\n");
        var col = p.save();
        expect(col.lexerState.line).toBe(3);
        p.feed("q");
        p.restore(col);
        expect(p.lexer.line).toBe(3);
        p.feed("z");
    });

    it("restores column number", function() {
        let p = new nearley.Parser(testGrammar);
        p.feed("foo\nbar");
        var col = p.save();
        expect(col.lexerState.line).toBe(2);
        expect(col.lexerState.col).toBe(3);
        p.feed("123");
        expect(p.lexerState.col).toBe(6);

        p.restore(col);
        expect(p.lexerState.line).toBe(2);
        expect(p.lexerState.col).toBe(3);
        p.feed("456");
        expect(p.lexerState.col).toBe(6);
    });

    // TODO: moo save/restore
});
