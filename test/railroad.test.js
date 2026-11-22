const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');

describe('nearley-railroad includes', function() {
    let directory;
    before(function() {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nearley-railroad-'));
        fs.mkdirSync(path.join(directory, 'parts'));
        fs.writeFileSync(path.join(directory, 'main.ne'), '@include "parts/child.ne"\n@include "parts/child.ne"\nmain -> child\n');
        fs.writeFileSync(path.join(directory, 'parts/child.ne'), '@include "../leaf.ne"\n@include "../main.ne"\nchild -> leaf\n');
        fs.writeFileSync(path.join(directory, 'leaf.ne'), '@builtin "whitespace.ne"\nleaf -> "a":+ _\n');
    });
    after(function() {
        ['main.ne', 'parts/child.ne', 'leaf.ne'].forEach(function(file) {
            fs.unlinkSync(path.join(directory, file));
        });
        fs.rmdirSync(path.join(directory, 'parts'));
        fs.rmdirSync(directory);
    });
    [false, true].forEach(function(stdin) {
        it('renders nested and built-in includes once with stdin=' + stdin, function() {
            const args = [path.join(__dirname, '../bin/nearley-railroad.js')];
            if (!stdin) args.push(path.join(directory, 'main.ne'));
            const result = spawnSync(process.execPath, args, {
                cwd: stdin ? directory : __dirname,
                input: '@include "main.ne"\n',
                encoding: 'utf8',
            });
            assert.strictEqual(result.status, 0, result.stderr);
            ['main', 'child', 'leaf', '_'].forEach(function(rule) {
                assert.strictEqual(result.stdout.split('<h1><code>' + rule + '</code></h1>').length - 1, 1);
            });
            assert.ok(result.stdout.includes('<svg'));
        });
    });
});
