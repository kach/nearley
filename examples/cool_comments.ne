# Grammar for parsing content of recursive comments of COOL (The Classroom Object-Oriented Language)
# Treat everything inside the outmost (**) as content
# Empty comment: (**)
# Recursive comments: (*(**)*) => (**), (*(*a*)(*b*)*) => (*a*)(*b*)
# Invalid comments: (*)*), (*(*), (*(**), (*(*)*)
# For details, check: http://theory.stanford.edu/~aiken/software/cool/cool.html

@{% function wrap(str) { return "(*" + str + "*)"; } %}

comment -> "(*" commentContent:* "*)" {% function(d) { return d[1].join(""); } %}

commentContent ->
      validCommentChar {% id %}
    | comment {% function(d) { return wrap(d[0]); } %}
    | "(":+ comment {% function(d) { return d[0].join("") + wrap(d[1]); } %}
    | comment ")":+ {% function(d) { return wrap(d[0]) + d[1].join(""); } %}
    | "(":+ comment ")":+ {% function(d) { return d[0].join("") + wrap(d[1]) + d[2].join(""); } %}

validCommentChar ->
      [^\(\)] {% id %}
    | "(":+ [^\*\(\)] {% function(d) { return d[0].join("") + d[1]; } %}
    | [^\*\(\)] ")":+ {% function(d) { return d[0] + d[1].join(""); } %}
    | "(":+ [^\*\(\)]:? ")":+ {% function(d) { return d[0].join("") + (d[1] || '') + d[2].join(""); } %}
