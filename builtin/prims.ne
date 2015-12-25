# Simple primitives used almost everywhere

# Postprocessor generator that lets you select the nth element of the list.
# `id` is equivalent to nth(0).
@{%
function nth(n) {
    return function(d) {
        return d[n];
    };
}
%}

# Postprocessor generator that lets you generate an object dynamically.
@{%
function obj(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        };
        return ret;
    };
}
%}

# A separated list of elements.

delimited[el, delim] -> $el ($delim $el {% nth(1) %}):* {%
    function(d) {
        return [d[0]].concat(d[1]);
    }
%}

# A JSON-compatible number (floating-point)
number -> "-":? [0-9]:+ ("." [0-9]:+):? ([eE] [+-]:? [0-9]:+):? {%
    function(d) {
        console.log(d);
        return parseFloat(
            (d[0] || "") +
            d[1].join("") +
            (d[2] ? d[2].join("") : "") +
            (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
        );
    }
%}

# Whitespace: `_` is optional, `__` is mandatory.
_  -> [\s]:* {% function(d) {return null;} %}
__ -> [\s]:+ {% function(d) {return null;} %}
