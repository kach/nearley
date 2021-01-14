@{%
const moo = require('moo')

const lexer = moo.compile({
  if: 'if',
  function: 'function',
  return: 'return'
});
const toText = (parts) => (parts.map(t => t.text));
%}

@lexer lexer

expression -> %if %function %return {% toText %}