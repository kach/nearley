
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const root = 'test/'

function sh(cmd) {
    return child_process.execSync(cmd, {encoding: 'utf-8', stdio: 'pipe', cwd: root});
}

var highestId = 0
function externalNearleyc(input, ext) {
    const tempPath = 'tmp.' + path.basename(input) + (++highestId)
    const stderr = sh("../bin/nearleyc.js " + input + " -o " + tempPath + ext);
    expect(stderr).toBe("")
    return tempPath
}

function cleanup() {
    for (let name of fs.readdirSync(root)) {
        if (/^tmp\./.test(name)) {
            fs.unlinkSync(path.join(root, name))
        }
    }
}

module.exports = {sh, externalNearleyc, cleanup}

