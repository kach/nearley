var PROMPT = "> ";

function runmath(s) {
    var ans;
    try {
        ans = new require("./calc-grammar.js")().feed(s);
        if (ans.results.length) {
            return ans.results[0].toString();
        } else {
            var out = new Array(PROMPT.length + s.length).join("-") + "^  Error.";
            return out;
        }
    } catch(e) {
        var out = new Array(PROMPT.length + e.offset + 1).join("-") + "^  Error.";
        return out;
    }
}

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(PROMPT);
rl.prompt();

rl.on('line', function(line) {
    console.log(runmath(line));
    rl.prompt();
}).on('close', function() {
    console.log('\nBye.');
    process.exit(0);
});
