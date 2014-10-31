# grammar used in Aycock, Horspool paper
# http://webhome.cs.uvic.ca/~nigelh/Publications/PracticalEarleyParsing.pdf

S -> A A A A

A -> "a"
   | E

E -> null
