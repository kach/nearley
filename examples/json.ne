# http://www.json.org/
# http://www.asciitable.com/
@{%

const moo = require('moo')

let lexer = moo.compile({
    SPACE: {match: /\s+/, lineBreaks: true},
    NUMBER: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    STRING: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    ',': ',',
    ':': ':',
    TRUE: /true\b/,
    FALSE: /false\b/,
    NULL: /null\b/,
})

// TODO add has() to moo
lexer.has = function(name) {
  return lexer.groups.find(function(group) {
    return group.tokenType === name;
  });
}

%}

@lexer lexer

json -> _ (object | array) _ {% function(d) { return d[1][0]; } %}

object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* _ "}" {% extractObject %}

array -> "[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (_ "," _ value):* _ "]" {% extractArray %}

value ->
      object {% id %}
    | array {% id %}
    | number {% id %}
    | string {% id %}
    | %TRUE {% function(d) { return true; } %}
    | %FALSE {% function(d) { return false; } %}
    | %NULL {% function(d) { return null; } %}

number -> %NUMBER {% function(d) { return parseFloat(d[0].value) } %}

string -> %STRING {% function(d) { return JSON.parse(d[0].value) } %}

pair -> key _ ":" _ value {% function(d) { return [d[0], d[4]]; } %}

key -> string {% id %}

_ -> null | %SPACE {% function(d) { return null; } %}

@{%

function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

%}
