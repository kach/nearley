const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');

describe('nearley-test exit statuses', function() {
    let directory, filename;
    before(function() {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nearley-test-'));
        filename = path.join(directory, 'grammar.js');
        fs.writeFileSync(filename, 'module.exports = ' + JSON.stringify({
            ParserRules: [
                {name: 'main', symbols: [{literal: 'a'}, {literal: 'b'}]},
                {name: 'main', symbols: [{literal: 'x'}]},
                {name: 'main', symbols: [{literal: 'x'}]},
            ],
            ParserStart: 'main',
        }));
    });
    after(function() {
        fs.unlinkSync(filename);
        fs.rmdirSync(directory);
    });
    [false, true].forEach(function(stdin) {
        [['ab', 0], ['a', 2], ['x', 3], ['z', 1]].forEach(function(test) {
            it('returns ' + test[1] + ' for ' + test[0] + ' with stdin=' + stdin, function() {
                const args = [path.join(__dirname, '../bin/nearley-test.js'), filename, '--quiet', '--strict'];
                if (!stdin) args.push('--input', test[0]);
                const result = spawnSync(process.execPath, args, {input: test[0], encoding: 'utf8'});
                assert.strictEqual(result.status, test[1], result.stderr);
                if (test[1] !== 1) assert.ok(result.stdout.trim().startsWith('['));
            });
        });
    });
    ['a', 'x'].forEach(function(input) {
        it('keeps the default success status for ' + input, function() {
            const result = spawnSync(process.execPath, [path.join(__dirname, '../bin/nearley-test.js'), filename, '-i', input]);
            assert.strictEqual(result.status, 0);
        });
    });
});
