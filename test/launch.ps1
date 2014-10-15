# ./test/launch.ps1 | Tee-Object -file test/profile.log
echo "Building test parser (this should check integrity)."
node bin/nearleyc.js test/parens.ne -o test/parens.js
echo "Parser build successfully."

date
echo "Running profiles..."
node test/profile.js
echo "Done running profiles."
date

echo "Testing exponential whitespace bug..."
(Measure-Command { node bin/nearleyc.js test/indentation.ne > $null }).ToString()
echo "Done with all tests."
