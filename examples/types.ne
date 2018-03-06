@{%

const mooLexer = require('moo').compile({
    space: { match:/[ \t\n]+/, lineBreaks: true },
    ident: {
        match: /[a-z][a-zA-Z0-9_]*/,
        keywords: { keyword: ['forall', 'exists'] }
    },
    lparen: '(',
    rparen: ')',
    star: '*',
    plus: '+',
    rarrow: '->',
    dot: '.'
});

%}

@lexer mooLexer

Main -> Tp       {% id %}

Tp4  -> %ident   {% id %}
      | "(" _ Tp _ ")"

Tp3  -> Tp4      {% id %}
      | Tp3 _ "*" _ Tp4

Tp2  -> Tp3      {% id %}
      | Tp2 _ "+" _ Tp3

Tp1  -> Tp2      {% id %}
      | Tp2 _ "->" _ Tp1

Tp   -> Tp1      {% id %}

_    -> %space:? {% id %}