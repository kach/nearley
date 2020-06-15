@{%
const tokenPrint = { literal: "print" };
const tokenNumber = { test: x => Number.isInteger(x) };
%}

main -> %tokenPrint %tokenNumber ";;"