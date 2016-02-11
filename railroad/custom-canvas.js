var DIMENSIONS = {
    'padding': 10,
    'arcrad': 10,
    'fontsize': 15
};


function railroad(grm) {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    var rules = {};
    grm.forEach(function(instr) {
        if (instr.rules) {
            if (!rules[instr.name]) {
                rules[instr.name] = [];
            }
            rules[instr.name] = rules[instr.name].concat(instr.rules);
        }
    });
    
    Object.keys(rules).forEach(function(r) {
        diagram(r);
    });



    function diagram(name) {
        var selectedrules = rules[name];
        var outer = {subexpression: selectedrules};


        var can = document.createElement('canvas');
        can.width  = 600;
        can.height = 500;
        var ctx = can.getContext('2d');
        ctx.font = DIMENSIONS.fontsize+"px monospace";
        ctx.textBaseline = "bottom";
        ctx.translate(0.5, 0.5);
        ctx.fillText(name, 0, DIMENSIONS.fontsize);
        ctx.translate(0, DIMENSIONS.fontsize + DIMENSIONS.padding);
        ctx.strokeRect(0, 0, 10, 10);
        ctx.translate(10, 5);

        function renderTok(tok) {
            // ctx translated to correct position already
            if (tok.subexpression) {
                var currentbound = new Point(0, 2*DIMENSIONS.arcrad);
                var rightPoint = 0;
                tok.subexpression.forEach(function(e) {
                    
                    ctx.beginPath();
                    ctx.arc(0, DIMENSIONS.arcrad, DIMENSIONS.arcrad, 0, Math.PI*3/2, true);
                    ctx.moveTo(DIMENSIONS.arcrad, DIMENSIONS.arcrad);
                    ctx.lineTo(DIMENSIONS.arcrad, currentbound.y-DIMENSIONS.arcrad);
                    ctx.arc(DIMENSIONS.arcrad*2, currentbound.y-DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI, Math.PI/2, true);
                    ctx.stroke();

                    ctx.save();
                    ctx.translate(DIMENSIONS.arcrad*2, currentbound.y);
                    var bnds = renderTok(e);
                    currentbound.x = Math.max(currentbound.x, bnds.x + 2*DIMENSIONS.arcrad);
                    currentbound.y += DIMENSIONS.padding*2 + bnds.y;

                    ctx.translate(bnds.x, 0);
                    if (currentbound.x > rightPoint) {
                        if (rightPoint > 0) {
                            ctx.beginPath();
                            ctx.moveTo(
                                DIMENSIONS.padding + rightPoint - currentbound.x + 2*DIMENSIONS.arcrad,
                                -currentbound.y + bnds.y + DIMENSIONS.padding*2
                            );
                            ctx.lineTo(
                                DIMENSIONS.padding + DIMENSIONS.arcrad*2,
                                -currentbound.y + bnds.y + DIMENSIONS.padding*2);
                            ctx.stroke();
                        }

                        rightPoint = currentbound.x;

                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.translate(rightPoint - bnds.x - 2*DIMENSIONS.arcrad, 0);
                    }
                    ctx.translate(DIMENSIONS.padding, 0);
                    ctx.arc(0, -DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI/2, 0, true);
                    ctx.translate(0, -currentbound.y + DIMENSIONS.arcrad + bnds.y + DIMENSIONS.padding*2);
                    ctx.lineTo(DIMENSIONS.arcrad, 0);
                    ctx.arc(DIMENSIONS.arcrad*2, 0, DIMENSIONS.arcrad, Math.PI, Math.PI*3/2);

                    ctx.stroke();
                    ctx.restore();
                });
                currentbound.x += 2*DIMENSIONS.arcrad + DIMENSIONS.padding;
                return currentbound;
            } else if (tok.ebnf) {
                if (tok.modifier === ":+") {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(DIMENSIONS.arcrad, 0);
                    ctx.stroke();
                    ctx.save();
                    ctx.translate(DIMENSIONS.arcrad, 0);
                    var bnds = renderTok(tok.ebnf);
                    ctx.restore();
                    ctx.beginPath();
                    ctx.arc(DIMENSIONS.arcrad, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI*3/2, Math.PI, true);
                    ctx.lineTo(0, bnds.y - DIMENSIONS.arcrad);
                    ctx.arc(DIMENSIONS.arcrad, bnds.y - DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI, Math.PI/2, true);
                    ctx.lineTo(bnds.x + DIMENSIONS.arcrad, bnds.y);
                    ctx.arc(bnds.x + DIMENSIONS.arcrad, bnds.y - DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI/2, 0, true);
                    ctx.lineTo(bnds.x + 2*DIMENSIONS.arcrad, DIMENSIONS.arcrad);
                    ctx.arc(bnds.x + DIMENSIONS.arcrad, DIMENSIONS.arcrad, DIMENSIONS.arcrad, 0, Math.PI*3/2, true);
                    ctx.lineTo(bnds.x + 2*DIMENSIONS.arcrad, 0);
                    ctx.stroke();
                    return new Point(bnds.x + 2*DIMENSIONS.arcrad, bnds.y + DIMENSIONS.arcrad);
                } else if (tok.modifier === ":?") {
                    ctx.beginPath();
                    ctx.arc(0, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI*3/2, 0);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(DIMENSIONS.arcrad*2, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI/2, Math.PI);
                    ctx.stroke();
                    ctx.save();
                    ctx.translate(DIMENSIONS.arcrad*2, DIMENSIONS.arcrad*2);
                    var bnds = renderTok(tok.ebnf);
                    ctx.restore();
                    ctx.beginPath();
                    ctx.arc(DIMENSIONS.arcrad*2, DIMENSIONS.arcrad, DIMENSIONS.arcrad, 0, Math.PI/2);
                    ctx.moveTo(DIMENSIONS.arcrad*3, DIMENSIONS.arcrad);
                    ctx.arc(DIMENSIONS.arcrad*4, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI, Math.PI*3/2);
                    ctx.save();
                    ctx.translate(bnds.x + 2*DIMENSIONS.arcrad, 0);
                    ctx.arc(-DIMENSIONS.arcrad*2, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI*3/2, 0);
                    ctx.moveTo(0, DIMENSIONS.arcrad*2);
                    ctx.arc(0, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI/2, Math.PI);
                    ctx.restore();
                    ctx.stroke();
                    ctx.translate(bnds.x + 2*DIMENSIONS.arcrad, 0);
                    ctx.beginPath();
                    ctx.arc(0, DIMENSIONS.arcrad, DIMENSIONS.arcrad, 0, Math.PI/2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(DIMENSIONS.arcrad*2, DIMENSIONS.arcrad, DIMENSIONS.arcrad, Math.PI, Math.PI*3/2);
                    ctx.stroke();
                    return new Point(bnds.x + 4*DIMENSIONS.arcrad, bnds.y);
                } else if (tok.modifier === ":*") {
                    var bnds = renderTok({
                        "ebnf": {
                            "ebnf": tok.ebnf,
                            "modifier": ":+"
                        },
                        "modifier": ":?"
                    });
                    return bnds;
                }
            } else if (tok.literal) {
                var str = JSON.stringify(tok.literal);
                var d = ctx.measureText(str).width;
                ctx.translate(0, -DIMENSIONS.fontsize/2);
                ctx.save();
                ctx.fillStyle = "yellow";
                ctx.fillRect(0, 0, d, DIMENSIONS.fontsize);
                ctx.restore();
                ctx.fillText(str, 0, DIMENSIONS.fontsize);
                return new Point(d, DIMENSIONS.fontsize/2);
            } else if (tok.mixin) {
                return new Point(0,0);
            } else if (tok.macrocall) {
                return new Point(0,0);
            } else if (tok.tokens) {
                var currentbound = new Point(0, 0);
                tok.tokens.forEach(function(t) {
                    ctx.save();
                    ctx.translate(currentbound.x, 0);
                    ctx.beginPath();
                    ctx.moveTo(0,0);
                    ctx.lineTo(DIMENSIONS.padding, 0);
                    ctx.stroke();
                    ctx.translate(DIMENSIONS.padding, 0);
                    currentbound.x += DIMENSIONS.padding;
                    var bnds = renderTok(t);
                    currentbound.x += bnds.x;
                    currentbound.y = Math.max(currentbound.y, bnds.y);
                    ctx.restore();
                });
                return currentbound;
            } else if (typeof(tok) === 'string') {
                ctx.save();
                ctx.font = DIMENSIONS.fontsize+"px serif";
                var d = ctx.measureText(tok).width;
                ctx.translate(0, -DIMENSIONS.fontsize/2);
                ctx.save();
                ctx.fillStyle = "#aac";
                ctx.fillRect(0, 0, d, DIMENSIONS.fontsize);
                ctx.restore();
                ctx.fillText(tok, 0, DIMENSIONS.fontsize);
                ctx.restore();
                return new Point(d, DIMENSIONS.fontsize/2);
            } else if (tok.constructor === RegExp) {
                var d = ctx.measureText(tok.toString()).width;
                ctx.translate(0, -DIMENSIONS.fontsize/2);
                ctx.fillText(tok.toString(), 0, DIMENSIONS.fontsize);
                ctx.strokeRect(0, 0, d, DIMENSIONS.fontsize);
                return new Point(d, DIMENSIONS.fontsize/2);
            } else {
                throw new Error();
            }
        }

        var bnds = renderTok(outer);
        ctx.translate(bnds.x, 0);
        ctx.strokeRect(0, -5, 10, 10);

        var img = document.createElement('img');
        img.src = can.toDataURL('image/png');
        document.body.appendChild(img);
    }
}

window.addEventListener('load', function() {
    railroad(test2);
}, false);





var testcase = [ [ { name: 'final',
      rules: 
       [ { tokens: [ 'whit?', 'prog', 'whit?' ],
           postprocess: ' function(d) { return d[1]; } ' } ] },
    { name: 'prog',
      rules: 
       [ { tokens: [ 'prod' ],
           postprocess: ' function(d) { return [d[0]]; } ' },
         { tokens: [ 'prod', 'whit', 'prog' ],
           postprocess: ' function(d) { return [d[0]].concat(d[2]); } ' } ] },
    { name: 'prod',
      rules: 
       [ { tokens: 
            [ 'word',
              'whit?',
              { ebnf: 
                 { subexpression: 
                    [ { tokens: [ { literal: '-' } ] },
                      { tokens: [ { literal: '=' } ] } ] },
                modifier: ':+' },
              { literal: '>' },
              'whit?',
              'expression+' ],
           postprocess: ' function(d) { return {name: d[0], rules: d[5]}; } ' },
         { tokens: 
            [ 'word',
              { literal: '[' },
              'wordlist',
              { literal: ']' },
              'whit?',
              { ebnf: 
                 { subexpression: 
                    [ { tokens: [ { literal: '-' } ] },
                      { tokens: [ { literal: '=' } ] } ] },
                modifier: ':+' },
              { literal: '>' },
              'whit?',
              'expression+' ],
           postprocess: ' function(d) {return {macro: d[0], args: d[2], exprs: d[8]}} ' },
         { tokens: [ { literal: '@' }, 'whit?', 'js' ],
           postprocess: ' function(d) { return {body: d[2]}; } ' },
         { tokens: [ { literal: '@' }, 'word', 'whit', 'word' ],
           postprocess: ' function(d) { return {config: d[1], value: d[3]}; } ' },
         { tokens: [ { literal: '@include' }, 'whit?', 'string' ],
           postprocess: ' function(d) {return {include: d[2].literal, builtin: false}} ' },
         { tokens: [ { literal: '@builtin' }, 'whit?', 'string' ],
           postprocess: ' function(d) {return {include: d[2].literal, builtin: true }} ' } ] },
    { name: 'expression+',
      rules: 
       [ { tokens: [ 'completeexpression' ] },
         { tokens: 
            [ 'expression+',
              'whit?',
              { literal: '|' },
              'whit?',
              'completeexpression' ],
           postprocess: ' function(d) { return d[0].concat([d[4]]); } ' } ] },
    { name: 'expressionlist',
      rules: 
       [ { tokens: [ 'completeexpression' ] },
         { tokens: 
            [ 'expressionlist',
              'whit?',
              { literal: ',' },
              'whit?',
              'completeexpression' ],
           postprocess: ' function(d) { return d[0].concat([d[4]]); } ' } ] },
    { name: 'wordlist',
      rules: 
       [ { tokens: [ 'word' ] },
         { tokens: [ 'wordlist', 'whit?', { literal: ',' }, 'whit?', 'word' ],
           postprocess: ' function(d) { return d[0].concat([d[4]]); } ' } ] },
    { name: 'completeexpression',
      rules: 
       [ { tokens: [ 'expr' ],
           postprocess: ' function(d) { return {tokens: d[0]}; } ' },
         { tokens: [ 'expr', 'whit?', 'js' ],
           postprocess: ' function(d) { return {tokens: d[0], postprocess: d[2]}; } ' } ] },
    { name: 'expr_member',
      rules: 
       [ { tokens: [ 'word' ], postprocess: ' id ' },
         { tokens: [ { literal: '$' }, 'word' ],
           postprocess: ' function(d) {return {mixin: d[1]}} ' },
         { tokens: [ 'word', { literal: '[' }, 'expressionlist', { literal: ']' } ],
           postprocess: ' function(d) {return {macrocall: d[0], args: d[2]}} ' },
         { tokens: [ 'string' ], postprocess: ' id ' },
         { tokens: [ 'charclass' ], postprocess: ' id ' },
         { tokens: 
            [ { literal: '(' },
              'whit?',
              'expression+',
              'whit?',
              { literal: ')' } ],
           postprocess: ' function(d) {return {\'subexpression\': d[2]} ;} ' },
         { tokens: [ 'expr_member', 'whit?', 'ebnf_modifier' ],
           postprocess: ' function(d) {return {\'ebnf\': d[0], \'modifier\': d[2]}; } ' } ] },
    { name: 'ebnf_modifier',
      rules: 
       [ { tokens: [ { literal: ':+' } ], postprocess: ' id ' },
         { tokens: [ { literal: ':*' } ], postprocess: ' id ' },
         { tokens: [ { literal: ':?' } ], postprocess: ' id ' } ] },
    { name: 'expr',
      rules: 
       [ { tokens: [ 'expr_member' ] },
         { tokens: [ 'expr', 'whit', 'expr_member' ],
           postprocess: ' function(d){ return d[0].concat([d[2]]); } ' } ] },
    { name: 'word',
      rules: 
       [ { tokens: [ /[\w\?\+]/ ],
           postprocess: ' function(d){ return d[0]; } ' },
         { tokens: [ 'word', /[\w\?\+]/ ],
           postprocess: ' function(d){ return d[0]+d[1]; } ' } ] },
    { name: 'string',
      rules: 
       [ { tokens: [ { literal: '"' }, 'charset', { literal: '"' } ],
           postprocess: ' function(d) { return { literal: d[1].join("") }; } ' } ] },
    { name: 'charset',
      rules: 
       [ { tokens: [ 'null' ] },
         { tokens: [ 'charset', 'char' ],
           postprocess: ' function(d) { return d[0].concat([d[1]]); } ' } ] },
    { name: 'char',
      rules: 
       [ { tokens: [ /[^\\"]/ ],
           postprocess: ' function(d) { return d[0]; } ' },
         { tokens: [ { literal: '\\' }, /./ ],
           postprocess: ' function(d) { return JSON.parse("\\""+"\\\\"+d[1]+"\\""); } ' } ] },
    { name: 'charclass',
      rules: 
       [ { tokens: [ { literal: '.' } ],
           postprocess: ' function(d) { return new RegExp("."); } ' },
         { tokens: [ { literal: '[' }, 'charclassmembers', { literal: ']' } ],
           postprocess: ' function(d) { return new RegExp("[" + d[1].join(\'\') + "]"); } ' } ] },
    { name: 'charclassmembers',
      rules: 
       [ { tokens: [ 'null' ] },
         { tokens: [ 'charclassmembers', 'charclassmember' ],
           postprocess: ' function(d) { return d[0].concat([d[1]]); } ' } ] },
    { name: 'charclassmember',
      rules: 
       [ { tokens: [ /[^\\\]]/ ],
           postprocess: ' function(d) { return d[0]; } ' },
         { tokens: [ { literal: '\\' }, /./ ],
           postprocess: ' function(d) { return d[0] + d[1]; } ' } ] },
    { name: 'js',
      rules: 
       [ { tokens: 
            [ { literal: '{' },
              { literal: '%' },
              'jscode',
              { literal: '%' },
              { literal: '}' } ],
           postprocess: ' function(d) { return d[2]; } ' } ] },
    { name: 'jscode',
      rules: 
       [ { tokens: [ 'null' ], postprocess: ' function() {return "";} ' },
         { tokens: [ 'jscode', /[^%]/ ],
           postprocess: ' function(d) {return d[0] + d[1];} ' },
         { tokens: [ 'jscode', { literal: '%' }, /[^}]/ ],
           postprocess: ' function(d) {return d[0] + d[1] + d[2]; } ' } ] },
    { name: 'whit',
      rules: 
       [ { tokens: [ 'whitraw' ] },
         { tokens: [ 'whitraw?', 'comment', 'whit?' ] } ] },
    { name: 'whit?',
      rules: [ { tokens: [ 'null' ] }, { tokens: [ 'whit' ] } ] },
    { name: 'whitraw',
      rules: [ { tokens: [ /[\s]/ ] }, { tokens: [ 'whitraw', /[\s]/ ] } ] },
    { name: 'whitraw?',
      rules: [ { tokens: [ 'null' ] }, { tokens: [ 'whitraw' ] } ] },
    { name: 'comment',
      rules: [ { tokens: [ { literal: '#' }, 'commentchars', { literal: '\n' } ] } ] },
    { name: 'commentchars',
      rules: 
       [ { tokens: [ 'null' ] },
         { tokens: [ 'commentchars', /[^\n]/ ] } ] } ] ][0]




test2 = [ [ { name: 'a',
      rules: 
       [ { tokens: 
            [ { ebnf: { literal: 'cow' }, modifier: ':?' },
              { literal: 'bee' },
              /[abc]/,
              { subexpression: [ { tokens: [ 'd' ] }, { tokens: [ 'e' ] }, { tokens: [ 'f' ] } ] } ] },
         { tokens: [ 'x' ] },
         { tokens: [ 'y' ] },
         { tokens: [ 'z' ] } ] } ] ][0]
