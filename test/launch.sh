echo "Building test parser (this should check integrity)."
bin/nearleyc.js test/parens.ne -o test/parens.js;
echo "Parser build successfully."

date > test/profile.log
echo "Running profiles...";
node test/profile.js >> test/profile.log;
echo "Done running profiles.";
cat test/profile.log

echo "Testing exponential whitespace bug..."
time bin/nearleyc.js test/indentation.ne > /dev/null

echo "Testing percent bug..."
bin/nearleyc.js test/percent.ne > /dev/null

echo "Testing nullable whitespace bug..."
bin/nearleyc.js test/whitespace.ne -o test/whitespace.js
bin/nearley-test.js test/whitespace.js -i "(x)" | sed -e '1,/Parse results:/d' \
    | diff - test/whitespace.expected || echo "[ FAILED ]"

if ! type "coffee" > /dev/null; then
    echo "Coffeescript not installed, skipping coffeescript test!";
else
    echo "Testing coffeescript template";
    bin/nearleyc.js test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee;
    coffee -c test/tmp.coffeescript-test.coffee;
    bin/nearley-test.js test/tmp.coffeescript-test.js -i "ABCDEFZ12309" > /dev/null;
fi

echo "Done with all tests."
