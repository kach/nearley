@preprocessor typescript
#@preprocessor typescript lexer Lexer

@{%
import { compile } from 'moo'
//import type { Lexer } from 'moo'

const lexer = compile({
  larrow: '<',
  rarrow: '>',
  integer: /[0-9]+/
});
%}

@lexer lexer

expression -> %larrow %integer %rarrow {% parts => parts.map(p => p.value) %}
