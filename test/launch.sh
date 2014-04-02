bin/nearleyc.js test/parens.ne -o test/parens.js;
date > test/profile.log
echo "Running profiles...";
node test/profile.js >> test/profile.log;
echo "Done.";