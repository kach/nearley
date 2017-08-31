---
title: Home
isDemoPage: true
---

**Parsers** turn strings of characters into meaningful data structures (like a
JSON object!). **nearley** is a **fast**, **feature-rich**, and **modern**
parser toolkit for JavaScript. nearley is an [npm Staff
Pick](https://github.com/npm/npm-collection-staff-picks).

### nearley 101

1. Install: `$ npm install -g nearley` (or try nearley live in your browser
   [here](https://omrelli.ug/nearley-playground/)!)
2. Write your grammar:
   ```
   # Match a CSS color
   # http://www.w3.org/TR/css3-color/#colorunits
   @builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
   @builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
   csscolor -> "#" hexdigit hexdigit hexdigit hexdigit hexdigit hexdigit
             | "#" hexdigit hexdigit hexdigit
             | "rgb"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")"
             | "hsl"  _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ ")"
             | "rgba" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")"
             | "hsla" _ "(" _ colnum _ "," _ colnum _ "," _ colnum _ "," _ decimal _ ")"
   hexdigit -> [a-fA-F0-9]
   colnum   -> int | percentage
   ```
3. Compile your grammar:
   ```
   $ nearleyc csscolor.ne -o csscolor.js
   ```
4. Test your grammar:
   ```
   $ nearley-test -i "#00ff00" csscolor.js
   Parse results: 
   [ [ '#', [ '0' ], [ '0' ], [ 'f' ], [ 'f' ], [ '0' ], [ '0' ] ] ]
   ```
5. Turn your grammar into a generator:
   ```
   $ nearley-unparse -n 3 csscolor.js
   #Ab21F2
   rgb  ( -29.889%,7,8172)
   #a40
   ```
6. You try it! Type a CSS color here:
   <input type="text" id="parse-input" placeholder="rgba(0, 255, 0, 0.5)" />
   <pre><code id="parse-output">…and the parsed output will appear here!</code></pre>
7. Create beautiful railroad diagrams to document your grammar formally.
   ```
   $ nearley-railroad csscolor.ne -o csscolor.html
   ```
   See a demo [here](/www/railroad-demo).

### Features

*  nearley is the first JS parser to use the **Earley** algorithm (insert your
   own ‘early bird’ pun here). It also implements Joop Leo's optimizations for
   right-recursion, making it effectively **linear-time** for LL(k) grammars.
*  nearley lives happily in **node**, but doesn't mind the **browser**.
*  nearley outputs **small** files. And its **expressive** DSL comes with
   plenty of **syntactic sugar** to keep your source files short. And sweet.
*  nearley's grammar language is powerful and expressive: you can use
   **macros**, import from a large **builtin library** of pre-defined
   parser-pieces, use a **tokenizer** for extra performance, and more!
*  nearley is built on an idiomatic **streaming API**. You even have access to
   partial parses to build **predictive** user interfaces.
*  nearley processes **left recursion** without choking. In fact, nearley will
   parse anything you throw at it without complaining or going into a ~~sulk~~
  infinite loop.
*  nearley handles **ambiguous grammars** gracefully. Ambiguous grammars can
   be parsed in multiple ways: instead of getting confused, nearley gives you
   all the parsings (in a deterministic order!).
*  nearley allows for debugging with generous **error detection**. When it
   catches a parse-time error, nearley tells you exactly what went wrong and
   where.
*  nearley is powerful enough to be **bootstrapped**. That means nearley uses
   nearley to compile parts of nearley. _nearleyception!_
*  nearley parsers can be inverted to form **generators** which output random
   strings that match a grammar. Useful for writing **test cases**,
   **fuzzers**, and **Mad-Libs**.
*  You can export nearley parsers as **railroad diagrams**, which provide
   easy-to-understand documentation of your grammar.
*  nearley comes with fantastic tooling. You can find editor plug-ins for
   **vim**, **Sublime Text**, **Atom**, and **VS Code**; there are also
   plug-ins for **Webpack** and **gulp**.

### Projects using nearley

**Artificial Intelligence and NLP**:
[Shrdlite](https://github.com/ChalmersGU-AI-course/shrdlite-course-project) is
a programming project in Artificial Intelligence, a course given at the
University of Gothenburg and Chalmers University of Technology. It uses nearley
for reading instructions in natural language (i.e. English).

**Standard formats**: [node-dmi](https://github.com/raymond-h/node-dmi) is a
module that reads iconstate metadata from BYOND DMI files,
[edtf.js](https://github.com/inukshuk/edtf.js) is a parser for Extended Date
Time Format, [node-krl-parser](https://github.com/farskipper/node-krl-parser)
is a KRL parser for node,
[bibliography](https://github.com/digitalheir/bibliography-js) is a
BibTeX-to-HTML converter,
[biblatex-csl-converter](https://github.com/fiduswriter/biblatex-csl-converter)
converts between bibtex/CSL/JSON, [scalpel](https://github.com/gajus/scalpel)
parses CSS selectors,
[rfc5545-rrule](https://github.com/waratuman/rfc5545-rrule) helps parse
iCalendar data, [mangudai](https://github.com/mangudai/mangudai) parses RMS
scripts for Age of Empires II, [tf-hcl](https://github.com/r24y/tf-hcl) parses
and generates HCL config files,
[css-selector-inspector](https://github.com/balbuf/css-selector-inspector)
parses and tokenizes CSS3 selectors,
[node-scad-parser](https://github.com/hhornbacher/node-scad-parser) parses
OpenSCAD 3D models, [js-sql-parse](https://github.com/justinkenel/js-sql-parse)
parses SQL statements.

**Templating and files**: [uPresent](https://github.com/bobbybee/uPresent) is a
markdown-based presentation authoring system,
[saison](https://github.com/rtsao/saison) is a minimal templating language,
[Packdown](https://github.com/imsky/packdown) is a tool to generate
human-readable archives of multiple files.

**Programming languages**: [Carbon](https://github.com/bobbybee/carbon) is a C
subset that compiles to JavaScript, optimized for game development,
[ezlang](https://github.com/tleb/ezlang) is a simple language,
[tlnccuwagnf](https://github.com/liam4/tlnccuwagnf) is a fun general-purpose
language, [nanalang](https://github.com/nanalan/g) is a silly esoteric
language, [english](https://github.com/nanalan/english) is a less esoteric
programming language, [ecmaless](https://github.com/farskipper/ecmaless) is an
easily-extensible language, [hm-parser](https://github.com/xodio/hm-parser)
parses Haskell-like Hindley-Milner type signatures,
[kozily](https://github.com/kozily/web) implements the Oz language,
[abstract-machine](https://stefan1niculae.github.io/abstract-machine/) inspects
execution models, [fbp-types](https://github.com/Malpaux/fbp-types) provides
typechecking primitives for flow-based systems,
[lp5562](https://github.com/sizigi/lp5562) is an assembler for the TI LP5562
LED driver, [VSL](https://github.com/vsl-lang/VSL) is a Versatile Scripting
Language, [while-typescript](https://github.com/juanlaube/while-typescript) is
an implementation of the WHILE language.

**Mathematics**: [Solvent](https://github.com/andrejewski/solvent) is a
powerful desktop calculator,
[Truth-table](https://github.com/andrejewski/truth-table) is a tool to
visualize propositional logic in truth tables, [Emunotes](http://emunotes.com)
is a personal Wiki with inline graphing and computation,
[react-equation](https://kgram.github.io/react-equation/) parses and renders
equations in React.

**Domain-specific languages**: [Hexant](https://github.com/jcorbin/hexant) is a
cellular automata simulator with a DSL for custom automata,
[Dicetower](https://github.com/justjake/dicetower) is an advanced dice plugin
for hubot, [deck.zone](https://github.com/seiyria/deck.zone) is a language to
create board games, [in-seconds](https://github.com/danigb/in-seconds) is a
time calculator for music applications,
[website-spec](https://github.com/bumbu/website-spec) is a tool for functional
web testing, [pianola](https://github.com/gajus/pianola) allows declarative
function composition, [idyll](https://idyll-lang.github.io/idyll/) is a markup
language for data-driven documents,
[virtsecgroup](https://github.com/affinipay/virtsecgroup) provides virtual AWS
security groups, [deadfad](https://github.com/Pwootage/deadfad) is a hex editor
that lets you specify structs,
[bishbosh](https://github.com/juliankrispel/bishbosh) helps you create
command-line interfaces, [syso](https://github.com/sgmap/syso) codifies aspects
of French legal contracts,
[siteswap](https://github.com/independentgeorge/siteswap.js) parses Siteswap
notation for juggling patterns, [jsgrep](https://github.com/amireh/jsgrep)
provides syntactic grep for JavaScript,
[electro-grammar](https://github.com/monostable/electro-grammar) parses
descriptions of electronic components like resistors and capacitors.

**Parsing libraries**: [nearley](http://nearley.js.org) is a parser toolkit for
JavaScript. It has a nearley-based DSL to specify parsers.

<!--Excited? Get started on [Github](https://github.com/Hardmath123/nearley),
visit us on [npm](http://npmjs.org/package/nearley), explore nearley in your
browser on the [playground](https://omrelli.ug/nearley-playground/), or try out
the [calculator demo](examples/calculator/) for more action.-->

