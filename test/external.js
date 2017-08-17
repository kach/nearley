
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const root = 'test/'

function sh(cmd) {
    return new Promise(resolve => {
        child_process.exec(cmd, {encoding: 'utf-8', stdio: 'pipe', cwd: root}, (err, out) => {
            resolve(out)
        })
    })
}

var highestId = 0
function externalNearleyc(input, ext) {
    const tempPath = 'tmp.' + path.basename(input) + (++highestId)
    return sh("../bin/nearleyc.js " + input + " -o " + tempPath + ext).then(stderr => {
        expect(stderr).toBe("")
        return tempPath
    })
}

function cleanup() {
    for (let name of fs.readdirSync(root)) { 
        if (/^tmp\./.test(name)) {
            fs.unlink(path.join(root, name), () => {}) // don't wait for this to finish
        }
    }
}

module.exports = {sh, externalNearleyc, cleanup}

