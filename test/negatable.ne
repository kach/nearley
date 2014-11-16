variable -> [a-z]:+ {%
    function(d, pos, reject) {
        if (d[0].join("") !== "if") {
            return d[0].join("");
        } else  {
            return reject;
        }
    }
%}
