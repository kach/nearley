@preprocessor typescript

@{%
import { compile } from 'moo'

const lexer = compile({
  larrow: '<',
  rarrow: '>',
  integer: /[0-9]+/
});
%}

@lexer lexer

expression -> %larrow %integer %rarrow {% parts => parts.map(p => p.value) %}
