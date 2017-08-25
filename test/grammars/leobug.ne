# https://github.com/Hardmath123/nearley/issues/159

S -> "a" "a" C "b" C
   | "a" C "b" C "a" C
   | "b" C "a" C "a" C

C -> C "a" C "a" C
   | "b" C
   | "b"
   | null
