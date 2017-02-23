# http://www.json.org/
# http://www.asciitable.com/

json -> [\s]:* (object | array) [\s]:* {% function(d) { return d[1][0]; } %}

object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* _ "}" {% extractObject %}

array -> "[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (_ "," _ value):* _ "]" {% extractArray %}

value ->
      object {% id %}
    | array {% id %}
    | number {% id %}
    | string {% id %}
    | "true" {% function(d) { return true; } %}
    | "false" {% function(d) { return false; } %}
    | "null" {% function(d) { return null; } %}

number -> "-":? ("0" | intPart) fracPart:? expPart:? {% extractNumber %}

string -> "\"" validChar:* "\"" {% function(d) { return d[1].join("") } %}

pair -> key _ ":" _ value {% function(d) { return [d[0], d[4]]; } %}

key -> string {% id %}

intPart -> [1-9] [0-9]:* {% function(d) { return d[0] + d[1].join(""); } %}

fracPart -> "." [0-9]:* {% function(d) { return d[0] + d[1].join(""); } %}

expPart -> [eE] [+-]:? [0-9]:* {% function(d) { return d[0] + (d[1] || '') + d[2].join(""); } %}

validChar ->
      [^"\\] {% function(d) { return d[0]; } %}
    | "\\\"" {% function(d) { return "\""; } %}
    | "\\\\" {% function(d) { return "\\"; } %}
    | "\\/" {% function(d) { return "/"; } %}
    | "\\n" {% function(d) { return "\n"; } %}
    | "\\b" {% function(d) { return "\b"; } %}
    | "\\f" {% function(d) { return "\f"; } %}
    | "\\r" {% function(d) { return "\r"; } %}
    | "\\t" {% function(d) { return "\t"; } %}
    | "\\u" hex hex hex hex {% unicodehex %}

hex -> [0-9a-fA-F] {% function(d) { return d[0]; } %}

_ -> null | [\s]:+ {% function(d) { return null; } %}

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

function unicodehex(d) {
    let codePoint = parseInt(d[1]+d[2]+d[3]+d[4], 16);

    // Handle '\\'
    if (codePoint == 92) {
        return "\\";
    }

    return String.fromCodePoint(codePoint);
}

function extractNumber(d) {
    let value = (d[0] || '') + d[1] + (d[2] || '') + (d[3] || '');
    return parseFloat(value);
}

%}
