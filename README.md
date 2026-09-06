# [nearley](http://nearley.js.org) ↗️
[![JS.ORG](https://img.shields.io/badge/js.org-nearley-ffb400.svg?style=flat-square)](http://js.org)
[![npm version](https://badge.fury.io/js/nearley.svg)](https://badge.fury.io/js/nearley)

nearley is a simple, fast and powerful parsing toolkit. It consists of:
1. [A powerful, modular DSL for describing
   languages](https://nearley.js.org/docs/grammar)
2. [An efficient, lightweight Earley
   parser](https://nearley.js.org/docs/parser)
3. [Loads of tools, editor plug-ins, and other
   goodies!](https://nearley.js.org/docs/tooling)

nearley is a **streaming** parser with support for catching **errors**
gracefully and providing _all_ parsings for **ambiguous** grammars. It is
compatible with a variety of **lexers** (we recommend
[moo](http://github.com/tjvr/moo)). It comes with tools for creating **tests**,
**railroad diagrams** and **fuzzers** from your grammars, and has support for a
variety of editors and platforms. It works in both node and the browser.

Unlike most other parser generators, nearley can handle *any* grammar you can
define in BNF (and more!). In particular, while most existing JS parsers such
as PEGjs and Jison choke on certain grammars (e.g. [left recursive
ones](http://en.wikipedia.org/wiki/Left_recursion)), nearley handles them
easily and efficiently by using the [Earley parsing
algorithm](https://en.wikipedia.org/wiki/Earley_parser).

nearley is used by a wide variety of projects:

- [artificial
  intelligence](https://github.com/ChalmersGU-AI-course/shrdlite-course-project)
  and
- [computational
  linguistics](https://wiki.eecs.yorku.ca/course_archive/2014-15/W/6339/useful_handouts)
  classes at universities;
- [file format parsers](https://github.com/raymond-h/node-dmi);
- [data-driven markup languages](https://github.com/idyll-lang/idyll-compiler);
- [compilers for real-world programming
  languages](https://github.com/sizigi/lp5562);
- and nearley itself! The nearley compiler is bootstrapped.

nearley is an npm [staff
pick](https://www.npmjs.com/package/npm-collection-staff-picks).

## Documentation

Please visit our website https://nearley.js.org to get started! You will find a
tutorial, detailed reference documents, and links to several real-world
examples to get inspired.

## Contributing

Please read [this document](.github/CONTRIBUTING.md) *before* working on
nearley. If you are interested in contributing but unsure where to start, take
a look at the issues labeled "up for grabs" on the issue tracker, or message a
maintainer (@kach or @tjvr on Github).

nearley is MIT licensed.

A big thanks to Nathan Dinsmore for teaching me how to Earley, Aria Stewart for
helping structure nearley into a mature module, and Robin Windels for
bootstrapping the grammar. Additionally, Jacob Edelman wrote an experimental
JavaScript parser with nearley and contributed ideas for EBNF support. Joshua
T. Corbin refactored the compiler to be much, much prettier. Bojidar Marinov
implemented postprocessors-in-other-languages. Shachar Itzhaky fixed a subtle
bug with nullables.

## Citing nearley

If you are citing nearley in academic work, please use the following BibTeX
entry.

```bibtex
@misc{nearley,
    author = "Kartik Chandra and Tim Radvan",
    title  = "{nearley}: a parsing toolkit for {JavaScript}",
    year   = {2014},
    doi    = {10.5281/zenodo.3897993},
    url    = {https://github.com/kach/nearley}
}
```


## 🌐 Web Resources & Interactive Index
- [CANNONS BLAST 3D](https://themindplay.pages.dev/cannons-blast-3d.html)
- [CATEGORY ADVENTURE](https://theskillquest.pages.dev/category-adventure.html)
- [CATEGORY MAHJONG 2](https://esskillcrafts.pages.dev/category-mahjong-2.html)
- [CATEGORY TOWER DEFENSE118](https://themindplaying.web.app/category-tower-defense118.html)
- [CRAZY BUS STATION](https://themindzone.pages.dev/crazy-bus-station.html)
- [3D CHESS MASTER](https://themindplaying.web.app/3d-chess-master.html)
- [LABUBU MERGE](https://themindplay.pages.dev/labubu-merge.html)
- [SPRUNKI CLICKER MERGE PHASE 3](https://theskillquest.pages.dev/sprunki-clicker-merge-phase-3.html)
- [SPRUNKI 3D ESCAPE](https://themindplaying.web.app/sprunki-3d-escape.html)
- [SCREW SPIN](https://themindzone.pages.dev/screw-spin.html)
- [PENTAWORD](https://themindzone.pages.dev/pentaword.html)
- [PALKOVIL THE WAY HOME](https://themindzone.pages.dev/palkovil-the-way-home.html)
- [FORTUNES DECK SOLITAIRE](https://themindplay.pages.dev/fortunes-deck-solitaire.html)
- [BOSS MARKET](https://themindzone.pages.dev/boss-market.html)
- [LAMPHEAD](https://themindzone.pages.dev/lamphead.html)
- [SINGLE LINE DRAWING PUZZLE](https://themindplays.pages.dev/single-line-drawing-puzzle.html)
- [CAKE LINK MASTER](https://theskillquest.pages.dev/cake-link-master.html)
- [CANDY JEWELS](https://themindplay.pages.dev/candy-jewels.html)
- [BUILD AN AQUAPARK](https://themindplays.pages.dev/build-an-aquapark.html)
- [BRAINROT CLEANING](https://theskillquest.pages.dev/brainrot-cleaning.html)
- [JEWEL DRESS UP](https://themindzone.pages.dev/jewel-dress-up.html)
- [BRAINROT MEGA PARKOUR](https://theskillquest.pages.dev/brainrot-mega-parkour.html)
- [RANCH ADVENTURES](https://themindplays.pages.dev/ranch-adventures.html)
- [INDEX12](https://skillplay.github.io/index12.html)
- [SOLITAIRE TAIL](https://themindzone.pages.dev/solitaire-tail.html)
- [CATEGORY BASKETBALL 2](https://iskillquest.pages.dev/category-basketball-2.html)
- [CATEGORY CAN T STOP PLAYING215](https://iskillquest.pages.dev/category-can-t-stop-playing215.html)
- [KINGDOM OF PIXELS](https://skillplay.github.io/kingdom-of-pixels.html)
- [CATEGORY PUZZLE 6](https://themindzone.pages.dev/category-puzzle-6.html)
- [WHEEL OF BINGO](https://themindplay.pages.dev/wheel-of-bingo.html)
- [CATEGORY PARTY23](https://themindplays.pages.dev/category-party23.html)
- [SCHOOL LOVE STORY 1](https://themindzone.pages.dev/school-love-story-1.html)
- [CATEGORY ADVENTURE 3](https://skillplay.github.io/category-adventure-3.html)
- [SUDOKU MASTER](https://theskillquest.pages.dev/sudoku-master.html)
- [OBBY PINATA PARTY](https://themindplays.pages.dev/obby-pinata-party.html)
- [SNIPER FOR BRAINROT](https://themindzone.pages.dev/sniper-for-brainrot.html)
- [JUMP IN TO THE PLANE](https://theskillquest.pages.dev/jump-in-to-the-plane.html)
- [BALLERINA CAPPUCCINA FIRST DATE](https://themindplaying.web.app/ballerina-cappuccina-first-date.html)
- [GARDEN BLOCK PUZZLE](https://themindplaying.web.app/garden-block-puzzle.html)
- [INDEX21](https://skillplay.github.io/index21.html)
- [CATEGORY BIKE63](https://skillplay.github.io/category-bike63.html)
- [POTTERY MASTER](https://theskillquest.pages.dev/pottery-master.html)
- [CARD QUEST 10 MINUTE ADVENTURE](https://theskillquest.pages.dev/card-quest-10-minute-adventure.html)
- [NINE CARDS OF WINTER](https://theskillquest.pages.dev/nine-cards-of-winter.html)
- [MADNESS DRIVER VERTIGO CITY](https://themindplays.pages.dev/madness-driver-vertigo-city.html)
- [WOOL SORTING](https://theskillquest.pages.dev/wool-sorting.html)
- [OVERPROTECTIVE BOYFRIEND](https://themindplaying.web.app/overprotective-boyfriend.html)
- [CATEGORY MANAGEMENT GAME](https://themindplaying.web.app/category-management-game.html)
- [CATEGORY BUSINESS137](https://themindplaying.web.app/category-business137.html)
- [NINJA CROSSWORD CHALLENGE](https://themindplaying.web.app/ninja-crossword-challenge.html)
- [SCP 173 ESCAPE](https://themindplays.pages.dev/scp-173-escape.html)
- [MAGIC BUBBLES](https://theskillquest.pages.dev/magic-bubbles.html)
- [SUPERHERO DROP AND SAVE](https://themindplaying.web.app/superhero-drop-and-save.html)
- [CATEGORY BUSINESS135](https://iskillquest.pages.dev/category-business135.html)
- [CATEGORY BLOCK94](https://iskillquest.pages.dev/category-block94.html)
- [SHADOWMAN RUNNER](https://themindzone.pages.dev/shadowman-runner.html)
- [SUPERHERO PHONE SIMULATOR](https://themindzone.pages.dev/superhero-phone-simulator.html)
- [TWO BLOCKS](https://themindzone.pages.dev/two-blocks.html)
- [BLOCKY ARCHER RUN](https://theskillquest.pages.dev/blocky-archer-run.html)
- [SOLITAIRE DELUXE EDITION](https://themindzone.pages.dev/solitaire-deluxe-edition.html)
- [DEVS SIMULATOR](https://themindzone.pages.dev/devs-simulator.html)
- [KIDS SUPERMARKET](https://themindplays.pages.dev/kids-supermarket.html)
- [GRANDMA RECIPE RAMEN](https://themindplays.pages.dev/grandma-recipe-ramen.html)
- [TAP HOLD](https://theskillquest.pages.dev/tap-hold.html)
- [WORD RIVERS](https://themindplaying.web.app/word-rivers.html)
- [CATEGORY ANIMAL](https://themindplaying.web.app/category-animal.html)
- [SUDOKU](https://themindzone.pages.dev/sudoku.html)
- [CATEGORY CASUAL 5](https://iskillquest.pages.dev/category-casual-5.html)
- [CAKE MERGE 2](https://themindzone.pages.dev/cake-merge-2.html)
- [BLACK PINK STPATRICKS DAY CONCERT](https://theskillquest.pages.dev/black-pink-stpatricks-day-concert.html)
- [CATEGORY LINKS](https://themindplays.pages.dev/category-links.html)
- [CLEAN HOUSE CLEARING TRASH AND DIRT](https://themindplays.pages.dev/clean-house-clearing-trash-and-dirt.html)
- [BLOCK LEGENDS](https://themindplays.pages.dev/block-legends.html)
- [CATEGORY TURN BASED](https://themindzone.pages.dev/category-turn-based.html)
- [CATEGORY BATTLESHIP19](https://iskillquest.pages.dev/category-battleship19.html)
- [ROAD TO 7](https://theskillquest.pages.dev/road-to-7.html)
- [STEAL BRAINROT ARENA](https://themindzone.pages.dev/steal-brainrot-arena.html)
- [HIDDEN OBJECTS ISLAND SECRETS](https://themindplays.pages.dev/hidden-objects-island-secrets.html)
- [SUPERPIXELINT](https://themindzone.pages.dev/superpixelint.html)
- [INDEX19](https://themindplaying.web.app/index19.html)
- [FUN IQ PUZZLE](https://themindplay.pages.dev/fun-iq-puzzle.html)
- [CATEGORY 1 PLAYER139](https://skillplay.github.io/category-1-player139.html)
- [NUTS BOLTS PUZZLE](https://themindzone.pages.dev/nuts-bolts-puzzle.html)
- [FRUIT MATCH JUICY PUZZLE](https://themindplays.pages.dev/fruit-match-juicy-puzzle.html)
- [CATEGORY CARTOON76](https://themindplays.pages.dev/category-cartoon76.html)
- [EARWAX CLINIC](https://themindplays.pages.dev/earwax-clinic.html)
- [WEDNESDAY DARK ACADEMIA](https://themindzone.pages.dev/wednesday-dark-academia.html)
- [BALL JUMP SWITCH THE COLORS](https://themindplay.pages.dev/ball-jump-switch-the-colors.html)
- [MEGA LAMBA RAMP](https://themindzone.pages.dev/mega-lamba-ramp.html)
- [CATEGORY MOBILE2 095](https://themindplays.pages.dev/category-mobile2-095.html)
- [FLAG MASTER WORLD FLAGS QUIZ](https://themindzone.pages.dev/flag-master-world-flags-quiz.html)
- [MICKEY RUN ADVENTURE GAME](https://theskillquest.pages.dev/mickey-run-adventure-game.html)
- [NESTING DOLLS](https://themindplaying.web.app/nesting-dolls.html)
- [GOING BALLS ADVENTURE 2](https://theskillquest.pages.dev/going-balls-adventure-2.html)
- [BANK ROBBERY 3](https://themindplays.pages.dev/bank-robbery-3.html)
- [BLOCKS AND THATS IT](https://iskillquest.pages.dev/blocks-and-thats-it.html)
- [STUNT BIKE RIDER BROS](https://iskillquest.pages.dev/stunt-bike-rider-bros.html)
- [CANDY JEWELS](https://themindzone.pages.dev/candy-jewels.html)
- [BABY PIANO CHILDREN SONG](https://theskillquest.pages.dev/baby-piano-children-song.html)
- [PIZZA PUZZLE](https://thelearnquesters.pages.dev/pizza-puzzle.html)
- [CATEGORY DESTROY256](https://themindplays.pages.dev/category-destroy256.html)
- [MAHJONG STACK](https://thequizzone.pages.dev/mahjong-stack.html)
- [TOBININ](https://iskillquest.pages.dev/tobinin.html)
- [PUZZLE LUB](https://thelearnquesters.pages.dev/puzzle-lub.html)
- [BRAINROTS LAVA SURVIVE ONLINE](https://themindplaying.web.app/brainrots-lava-survive-online.html)
- [FRUITSLAND ESCAPE FROM THE AMUSEMENT PARK](https://themindzone.pages.dev/fruitsland-escape-from-the-amusement-park.html)
- [MAHJONG 3D MATCH](https://themindplaying.web.app/mahjong-3d-match.html)
- [COSMIC TETRIZ PUZZLES](https://thequizzone.pages.dev/cosmic-tetriz-puzzles.html)
- [MEMOJI](https://thequizzone.pages.dev/memoji.html)
- [CASTLE CRAFT](https://themindplays.pages.dev/castle-craft.html)
- [MAFIA SNIPER CRIME SHOOTING](https://iskillquest.pages.dev/mafia-sniper-crime-shooting.html)
- [PANDA KITCHEN IDLE TYCOON](https://iskillquest.pages.dev/panda-kitchen-idle-tycoon.html)
- [ZOMBIE CHASE](https://themindplays.pages.dev/zombie-chase.html)
- [STICKMAN DOORS AND ISLAND](https://theskillquest.pages.dev/stickman-doors-and-island.html)
- [INDIAN SUV OFFROAD SIMULATOR](https://iskillquest.pages.dev/indian-suv-offroad-simulator.html)
- [MINECRAFT BATTLE PARTY](https://iskillquest.pages.dev/minecraft-battle-party.html)
- [THE BRANCH RUNNER](https://themindplays.pages.dev/the-branch-runner.html)
- [SEEK FIND](https://thequizzone.pages.dev/seek-find.html)
- [OPENGUESSR](https://themindplay.pages.dev/openguessr.html)
- [HAND OVER HAND](https://thelearnquesters.pages.dev/hand-over-hand.html)
- [BASKETBALL LIFE 3D](https://themindzone.pages.dev/basketball-life-3d.html)
- [CATEGORY FIGHTING124](https://iskillquest.pages.dev/category-fighting124.html)
- [SKIP LOVE](https://iskillquest.pages.dev/skip-love.html)
- [ELLIE AND BEN CHRISTMAS EVE](https://thelearnquesters.pages.dev/ellie-and-ben-christmas-eve.html)
- [CATEGORY TOP DOWN251](https://theskillquest.pages.dev/category-top-down251.html)
- [FRUIT CATCHER](https://thelearnquesters.pages.dev/fruit-catcher.html)
- [GALACTIC CRUSADE CLICKER](https://themindplaying.web.app/galactic-crusade-clicker.html)
- [DYNAMONS 11](https://themindplay.pages.dev/dynamons-11.html)
- [MOTO STUNT BIKER](https://thelearnquesters.pages.dev/moto-stunt-biker.html)
- [THIEF STICK PUZZLE MAN ESCAPE](https://themindzone.pages.dev/thief-stick-puzzle-man-escape.html)
