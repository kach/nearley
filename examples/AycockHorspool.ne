# grammar used in Aycock, Horspool paper
# http://webhome.cs.uvic.ca/~nigelh/Publications/PracticalEarleyParsing.pdf

S -> A A A A

A -> "a"
   | E

E -> null

# the set of charts produced by the input "aa"
#
# 0
#  0: {_start → ● S},   from: 0 created by: Start
#  1: {S → ● A A A A},  from: 0 created by: Predict,0,0
#  2: {A → ● "a"},      from: 0 created by: Predict,0,1
#  3: {A → ● E},        from: 0 created by: Predict,0,1
#  4: {E → ● },         from: 0 created by: Predict,0,3
#  5: {A → E ● },       from: 0 created by: Complete,0,4
#  6: {S → A ● A A A},  from: 0 created by: Complete,0,5
#  7: {S → A A ● A A},  from: 0 created by: Complete,0,5
#  8: {S → A A A ● A},  from: 0 created by: Complete,0,5
#  9: {S → A A A A ● }, from: 0 created by: Complete,0,5
# 10: {_start → S ● },  from: 0 created by: Complete,0,9
# 
# 1
#  0: {A → "a" ● },     from: 0 created by: Scan,0,2
#  1: {S → A ● A A A},  from: 0 created by: Complete,1,0
#  2: {S → A A ● A A},  from: 0 created by: Complete,1,0
#  3: {S → A A A ● A},  from: 0 created by: Complete,1,0
#  4: {S → A A A A ● }, from: 0 created by: Complete,1,0
#  5: {A → ● "a"},      from: 1 created by: Predict,1,1
#  6: {A → ● E},        from: 1 created by: Predict,1,1
#  7: {_start → S ● },  from: 0 created by: Complete,1,4
#  8: {E → ● },         from: 1 created by: Predict,1,6
#  9: {A → E ● },       from: 1 created by: Complete,1,8
# 10: {S → A A ● A A},  from: 0 created by: Complete,1,9
# 11: {S → A A A ● A},  from: 0 created by: Complete,1,9
# 12: {S → A A A A ● }, from: 0 created by: Complete,1,9
# 13: {S → A A A ● A},  from: 0 created by: Complete,1,9
# 14: {S → A A A A ● }, from: 0 created by: Complete,1,9
# 15: {S → A A A A ● }, from: 0 created by: Complete,1,9
# 16: {_start → S ● },  from: 0 created by: Complete,1,12
# 17: {_start → S ● },  from: 0 created by: Complete,1,14
# 18: {_start → S ● },  from: 0 created by: Complete,1,15
# 
# 2
#  0: {A → "a" ● },     from: 1 created by: Scan,1,5
#  1: {S → A A ● A A},  from: 0 created by: Complete,2,0
#  2: {S → A A A ● A},  from: 0 created by: Complete,2,0
#  3: {S → A A A A ● }, from: 0 created by: Complete,2,0
#  4: {S → A A A ● A},  from: 0 created by: Complete,2,0
#  5: {S → A A A A ● }, from: 0 created by: Complete,2,0
#  6: {S → A A A A ● }, from: 0 created by: Complete,2,0
#  7: {A → ● "a"},      from: 2 created by: Predict,2,1
#  8: {A → ● E},        from: 2 created by: Predict,2,1
#  9: {_start → S ● },  from: 0 created by: Complete,2,3
# 10: {_start → S ● },  from: 0 created by: Complete,2,5
# 11: {_start → S ● },  from: 0 created by: Complete,2,6
# 12: {E → ● },         from: 2 created by: Predict,2,8
# 13: {A → E ● },       from: 2 created by: Complete,2,12
# 14: {S → A A A ● A},  from: 0 created by: Complete,2,13
# 15: {S → A A A A ● }, from: 0 created by: Complete,2,13
# 16: {S → A A A A ● }, from: 0 created by: Complete,2,13
# 17: {S → A A A A ● }, from: 0 created by: Complete,2,13
# 18: {_start → S ● },  from: 0 created by: Complete,2,15
# 19: {_start → S ● },  from: 0 created by: Complete,2,16
# 20: {_start → S ● },  from: 0 created by: Complete,2,17
