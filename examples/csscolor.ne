# http://www.w3.org/TR/css3-color/#colorunits

@builtin "whitespace.ne"
@builtin "number.ne"

csscolor -> "#" hexdigit hexdigit hexdigit hexdigit hexdigit hexdigit
          | "#" hexdigit hexdigit hexdigit
          | "rgb"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")"
          | "hsl"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")"
          | "rgba" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")"
          | "hsla" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")"

hexdigit -> [a-fA-F0-9]
colnum -> posint | percentage
