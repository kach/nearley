echo "Building test parser (this should check integrity)."
bin/nearleyc.js test/parens.ne -o test/parens.js;
echo "Parser build successfully."

echo "Testing templates...";
echo "  CoffeeScript:";
if ! type "coffee" > /dev/null; then
  echo "Error, no command 'coffee' found, skipping test!";
else
  echo "    Building parser...";
  bin/nearleyc.js test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee;
  echo "    Translating parser for 'nearley-test'...";
  coffee -c test/tmp.coffeescript-test.coffee;
  echo "    Testing parser...";
  bin/nearley-test.js "test/tmp.coffeescript-test.js" -i "AABCBCA" > /dev/null;
fi

date > test/profile.log;
echo "Running profiles...";
node test/profile.js >> test/profile.log;
echo "Done running profiles.";
cat test/profile.log;

echo "Testing exponential whitespace bug...";
time bin/nearleyc.js test/indentation.ne > /dev/null;

echo "Testing percent bug...";
bin/nearleyc.js test/percent.ne > /dev/null;

echo "Done with all tests.";
