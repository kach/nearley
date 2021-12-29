---
title: Tooling
---

nearley ships with a host of tools to help you develop, test, and maintain your
grammars easily.

### nearley-test: Exploring a parser interactively

A global install of nearley provides `nearley-test`, a simple command-line tool
you can use to inspect what a parser is doing. You input a generated
`grammar.js` file, and then give it some input to test the parser against.
`nearley-test` prints out the output if successful, and optionally
pretty-prints the internal parse table used by the algorithm. This is helpful
to test a new parser.

### nearley-unparse: The Unparser

The Unparser takes a (compiled) parser and outputs a random string that would
be accepted by the parser.

```bash
$ nearley-unparse -s jsonfloat <(nearleyc builtin/number.ne)
-6.22E94
```

You can use the Unparser to...

- ...test your parser specification by generating lots of random expressions
  and making sure all of them are "correct".
- ...generate random strings from a schema (for example, random email addresses
  or telephone numbers).
- ...create fuzzers and combinatorial stress-testers.
- ...play "Mad-Libs" automatically! (Practical application: automatic
  grammatically valid loremtext.)

The Unparser outputs as a stream by continuously writing characters to its
output pipe. So, if it "goes off the deep end" and generates a huge string, you
will still see output scrolling by in real-time.

To limit the size of the output, you can specify a bound on the depth with the
`-d` flag. This switches the Unparser to a different algorithm. A larger depth
bound corresponds to larger generated strings.

As far as I know, nearley is the only parser generator with this feature. It
is inspired by Roly Fentanes' [randexp](https://fent.github.io/randexp.js/),
which does the same thing with regular expressions.

Chase Meadors wrote a standalone nearley-unparse module,
[nearley-generator](https://github.com/cemulate/nearley-generator), which
powers [mLab](https://cemulate.github.io/the-mlab/), and you can play with it
in the browser [here](http://bnfplayground.pauliankline.com).

### nearley-railroad: Automagical Railroad Diagrams

nearley lets you convert your grammars to pretty SVG railroad diagrams that you
can include in webpages, documentation, and even papers.

```bash
$ nearley-railroad regex.ne -o grammar.html
```

![Railroad demo](/www/railroad-demo.png)

See a bigger example [here](/www/railroad-demo).

This feature is powered by
[`railroad-diagrams`](https://github.com/tabatkins/railroad-diagrams) by
tabatkins.

See also:
[better-nearley-railroad](https://github.com/Floffah/better-nearley-railroad)
(a third-party alternative)

### Other Tools

*This section lists nearley tooling created by other developers. These tools
are not distributed with nearley, so if you have problems, please contact the
respective author for support instead of opening an issue with nearley.*

**Atom** users can write nearley grammars with [this
plugin](https://github.com/bojidar-bg/nearley-grammar) by Bojidar Marinov.

**TextMate** and **Sublime Text** users can use [this
language](https://github.com/Hardmath123/sublime-nearley) by yours truly.

**Sublime Text** users can write nearley grammars with [this
syntax](https://github.com/liam4/nearley-syntax-sublime) by liam4.

**Vim** users can use [this plugin](https://github.com/tjvr/vim-nearley) by Tim
(based on [this older plugin](https://github.com/andres-arana/vim-nearley) by
Andrés Arana).

**Visual Studio Code** users can use [this
extension](https://github.com/karyfoundation/nearley-vscode) by Pouya Kary.

**Python** users can convert nearley grammars to Python using
[lark](https://github.com/erezsh/lark#how-to-use-nearley-grammars-in-lark) by
Erez.

**Node** users can programmatically access the unparser using
[nearley-there](https://github.com/stolksdorf/nearley-there) by Scott
Tolksdorf.

**Browser** users can use
[nearley-playground](https://omrelli.ug/nearley-playground/) by Guillermo
Webster to explore nearley interactively in the browser. There is also a [Mac
app](https://github.com/pmkary/nearley-playground-mac) by Pouya Kary.

**Webpack** users can use
[nearley-loader](https://github.com/kozily/nearley-loader) by Andrés Arana to
load grammars directly.

**Gulp** users can use
[gulp-nearley](https://github.com/JosephJNK/gulp-nearley) by Joseph Junker to
compile grammars with a gulpfile.

**Node** users can quickly create the framework for a large nearley-based
project using [nearley-template](https://github.com/appology/nearley-template).

**Parcel** users can use
[parcel-plugin-nearley](https://github.com/adam1658/parcel-plugin-nearley) by
Adam Rich to load grammars directly.

**Jest** users can use
[jest-transform-nearley](https://github.com/adam1658/jest-transform-nearley) by
Adam Rich to load grammars directly.

**Nearley for Deno** use your compiled parser in deno with
[this nearley deno port](https://deno.land/x/nearley) by Olivier Guimbal
