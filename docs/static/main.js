window.addEventListener("load", function() {
    var grammarInput = document.getElementById("grammar-input");
    var compileInput = document.getElementById("compile-grammar");
    compileInput.addEventListener("click", function() {
        var grm = grammarInput.value;
        var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
        parser.feed(grammarInput.value);
        var result = parser.results[0];
        var compiled = Compile(result, {});
        var js = generate(compiled);
        window.open("data:text/javascript;charset=utf-8,"+encodeURIComponent(js));
    }, false);

}, false);
