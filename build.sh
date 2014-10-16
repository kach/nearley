./bin/nearleyc.js ./lib/nearley-language-bootstrapped.ne -o grammar.tmp
mv grammar.tmp ./lib/nearley-language-bootstrapped.js

npm test
