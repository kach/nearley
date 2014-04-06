var Writable = require('stream').Writable;
var Parser = require('./nearley.js').Parser;
var util = require('util');

function NearleyStream(parser) {
    Writable.call(this, { decodeStrings: false });
    this._parser = parser;
    this.on('finish', function () {
        if (parser.results[0]) {
            this.emit('result', parser.results[0].data);
        } else {
            this.emit('error', new Error("nearley parse error"));
        }
    });

    this._write = function (chunk, encoding, callback) {
        chunk = chunk.toString();
        parser.feed(chunk);
        callback();
    };
}

util.inherits(NearleyStream, Writable);

module.exports = NearleyStream;
