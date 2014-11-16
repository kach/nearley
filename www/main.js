window.addEventListener("load", function() {
    var grammarInput = document.getElementById("grammar-input");
    var testInput = document.getElementById("test-input");
    var compileInput = document.getElementById("compile-grammar");
    compileInput.addEventListener("click", function() {
        var grm = grammarInput.value;
        var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
        parser.feed(grammarInput.value);
        var result = parser.results[0];
        visualizeAST(result);
        var compiled = Compile(result);
        var js = generate(compiled);
        window.open("data:text/javascript;charset=utf-8,"+encodeURIComponent(js));
        console.log(js);
    }, false);


    function uniquegen() {
        return "$" + uniquegen.$++;
    }
    uniquegen.$ = 0;

    function buildAST(cy, obj) {
        var id = uniquegen();
        cy.add({
            group: 'nodes',
            data: {id: id, val: typeof(obj) === 'object' ? '' : JSON.stringify(obj)}
        });
        if (typeof(obj) === 'object') {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    var o = obj[i];
                    var n = buildAST(cy, o);
                    cy.add({
                        group: 'edges',
                        data: {source: id, target: n, val: i}
                    });
                }
            }
        }
        return id;
    }
    var oldcy = null;
    function visualizeAST(AST) {
        if (oldcy) {
            oldcy.destroy();
        }
        var container = document.createElement("div");
        container.style.height = "700px";
        document.getElementById("cy-viz").appendChild(container);
        oldcy = cytoscape({
            container: container,
            elements: {
                nodes: [
                ],
                edges: [
                ]
            },
            layout: {
                name: 'breadthfirst'
            },
            style: [{
                selector: 'node',
                css: {
                    'content': 'data(val)'
                }
            }, {
                selector: 'edge',
                css: {
                    'target-arrow-shape': 'triangle',
                    'content': 'data(val)'
                }
            }]
        });
        buildAST(oldcy, AST);
    }
}, false);
