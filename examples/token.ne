@{%
var ws = {literal: " "};
var number = {test: function(n) {
    return n.constructor === Number;
}};
%}

main -> %number (%number %ws %number):+
