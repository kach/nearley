# https://en.wikipedia.org/wiki/Earley_parser#Example

P -> S

S -> S "+" M
   | M

M -> M "*" T
   | T

T -> "1"
   | "2"
   | "3"
   | "4"