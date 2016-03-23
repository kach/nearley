require('shelljs/global');

echo('Building nearley...');
exec('node bin/nearleyc.js lib/nearley-language-bootstrapped.ne > grammar.tmp');
echo('Deleting temp file...');
mv('grammar.tmp', './lib/nearley-language-bootstrapped.js');