echo "Building test parser (this should check integrity)."
bin/nearleyc.js test/parens.ne -o test/parens.js;
echo "Parser build successfully."
date > test/profile.log
echo "Running profiles...";
node test/profile.js >> test/profile.log;
echo "Done running profiles.";

echo "Testing exponential whitespace bug..."
time bin/nearleyc.js test/indentation.ne > /dev/null
echo "Done with all tests."
