# http://www.w3.org/TR/css3-color/#colorunits

@builtin "whitespace.ne"
@builtin "number.ne"
@builtin "postprocessors.ne"

csscolor -> "#" hexdigit hexdigit hexdigit hexdigit hexdigit hexdigit {%
    function(d) {
        return {
            "r": parseInt(d[1]+d[2], 16),
            "g": parseInt(d[3]+d[4], 16),
            "b": parseInt(d[5]+d[6], 16),
        }
    }
%}
          | "#" hexdigit hexdigit hexdigit {%
    function(d) {
        return {
            "r": parseInt(d[1]+d[1], 16),
            "g": parseInt(d[2]+d[2], 16),
            "b": parseInt(d[3]+d[3], 16),
        }
    }
%}
          | "rgb"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")" {% $({"r": 4, "g": 8, "b": 12}) %}
          | "hsl"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")" {% $({"h": 4, "s": 8, "l": 12}) %}
          | "rgba" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")" {% $({"r": 4, "g": 8, "b": 12, "a": 16}) %}
          | "hsla" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")" {% $({"h": 4, "s": 8, "l": 12, "a": 16}) %}

hexdigit -> [a-fA-F0-9]
colnum -> unsigned_int {% id %} | percentage {%
    function(d) {return Math.floor(d[0]*255); }
%}
