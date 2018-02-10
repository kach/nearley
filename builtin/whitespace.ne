# Whitespace: `_` is optional, `__` is mandatory.
_  -> wschar:* {% nuller %}
__ -> wschar:+ {% nuller %}

wschar -> [ \t\n\v\f] {% id %}
