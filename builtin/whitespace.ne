# Whitespace: `_` is optional, `__` is mandatory.
_  -> wschar:* {% function() {return null;} %}
__ -> wschar:+ {% function() {return null;} %}

wschar -> [ \t\n\v\f] {% id %}
