# nearley grammar


final -> whit? prog whit?  {% function(d) { return d[1]; } %}

prog -> prod  {% function(d) { return [d[0]]; } %}
      | prod whit prog  {% function(d) { return [d[0]].concat(d[2]); } %}

prod -> word whit? "-" ">" whit? expression+  {% function(d) { return {name: d[0], rules: d[5]}; } %}
      | "@" whit? js  {% function(d) { return {body: d[2]}; } %}

expression+ -> completeexpression
             | expression+ whit? "|" whit? completeexpression  {% function(d) { return d[0].concat([d[4]]); } %}

completeexpression -> expr  {% function(d) { return {tokens: d[0]}; } %}
                    | expr whit? js  {% function(d) { return {tokens: d[0], postprocess: d[2]}; } %}

expr -> word
      | string
      | charclass
      | expr whit word  {% function(d){ return d[0].concat([d[2]]); } %}
      | expr whit string  {% function(d){ return d[0].concat([d[2]]); } %}
      | expr whit charclass  {% function(d) { return d[0].concat([d[2]]); } %}

word -> [\w\?\+]  {% function(d){ return d[0]; } %}
      | word [\w\?\+]  {% function(d){ return d[0]+d[1]; } %}

string -> "\"" charset "\""  {% function(d) { return { literal: d[1].join("") }; } %}

charset -> null
         | charset char  {% function(d) { return d[0].concat([d[1]]); } %}

char -> [^ \\\\ \"]  {% function(d) { return d[0]; } %}  # not sure if i got this right new RegExp("[^ \\\\ \"]")
      | "\\" .  {% function(d) { return JSON.parse("\""+"\\"+d[1]+"\""); } %}

charclass -> "."  {% function(d) { return new RegExp("."); } %}
           | "[" charclassmembers "]"  {% function(d) { return new RegExp("[" + d[1].join('') + "]"); } %}

charclassmembers -> null
                  | charclassmembers charclassmember  {% function(d) { return d[0].concat([d[1]]); } %}

charclassmember -> [^\\\]]  {% function(d) { return d[0]; } %}
                 | "\\" .  {% function(d) { return d[0] + d[1]; } %}

js -> "{" "%" jscode "%" "}"  {% function(d) { return d[2]; } %}

jscode -> null  {% function() {return "";} %}
        | jscode [^%]  {% function(d) {return d[0] + d[1];} %}

# Whitespace with a comment
whit -> whitraw
      | whitraw? comment whit?

# Optional whitespace with a comment
whit? -> null
       | whit

# Literally a string of whitespace
whitraw -> [\s]
         | whitraw [\s]

# A string of whitespace OR the empty string
whitraw? -> null
          | whitraw

comment -> "#" commentchars "\n"
commentchars -> null
              | commentchars [^\n]
