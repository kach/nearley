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

if ! type "coffee" > /dev/null; then
    echo "Coffeescript not installed, skipping coffeescript test!";
else
    echo "Testing coffeescript template";
    bin/nearleyc.js test/coffeescript-test.ne -o test/tmp.coffeescript-test.coffee;
    coffee -c test/tmp.coffeescript-test.coffee;
    nearley-test test/tmp.coffeescript-test.js -i "ABCDEFZ12309" > /dev/null;
fi

echo "Done with all tests."
