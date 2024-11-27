// Node-only

var Writable = require('stream').Writable;
var util = require('util');

function StreamWrapper(parser) {
    Writable.call(this);
    this._parser = parser;
    this._buffer='';
}

util.inherits(StreamWrapper, Writable);


StreamWrapper.prototype._write = function write(chunk, encoding, callback) {
    //https://github.com/kach/nearley/issues/632
    //Token might be span multiple chunks. 
    var chunkString = chunk.toString();
    var idxLastNewline = chunkString.lastIndexOf('\n');
    if (idxLastNewline === -1 ) {
        this._buffer += chunkString;
        return;
    }

    var alteredChunk = this._buffer + chunkString.substring(0,idxLastNewline);
    this._buffer= chunkString.substring(idxLastNewline);

    this._parser.feed(alteredChunk);
    callback();
};

StreamWrapper.prototype._final = function final(callback) {
    this._parser.feed(this._buffer);
    this._buffer = '';
    callback();
}

module.exports = StreamWrapper;
