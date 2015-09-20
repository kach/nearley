var nearley = require("../../");
var grammar = require("./context-grammar.js")
var assert = require('assert')


describe('Parser([rules], [start], [context])', function () {
  it('will invoke each rule (e.g postprocessor) with context as this', function () {
    assertParse('toupper \'HeLLo wORLd\'', 'HELLO WORLD')
    assertParse('tolower \'HeLLo wORLd\'', 'hello world')
  })

  function assertParse(text, expected) {
    var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart, createContext())
    p.feed(text)

    assert.equal(p.results, expected, [
      'Expected parsing of "', text,
      '" to be "', expected,
      '" but got "', p.results, '"'
    ].join(''))
  }

  function createContext() {
    return {
      null: function (d) {
        // console.log('null: %j', d)
        return null
      },
      id: function (d) {
        // console.log('id: %j', d)
        return d
      },
      string: function (d) {
        // console.log('string: %j', d)
        return d.join('')
      },
      toUpper: function (d) {
        // console.log('toUpper: %j', d)
        return d.toUpperCase()
      },
      toLower: function (d) {
        // console.log('toLower: %j', d)
        return d.toLowerCase()
      }
    }
  }
})
/*
var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart, context)
p.feed('toupper \'hello\'')
console.log(p.results)


p.feed('tolower \'WorlD\'')
console.log(p.results)
*/
