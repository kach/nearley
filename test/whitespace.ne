@builtin "whitespace.ne"

d -> a

a -> b _ "&"
   | b

b -> letter
   | "(" _ d _ ")"

letter -> [a-z]
