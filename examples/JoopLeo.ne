# the grammar used in Joop Leo's paper
# Joop Leo "A general context-free parsing algorithm running in linear time on every LR(k) grammar without using lookahead"
# input (a^n)(b^m)  where n >= m
# eg.
# a
# ab
# aa
# aab
# aabb . . .

S -> "a" S | C
C -> "a" C "b" | null
