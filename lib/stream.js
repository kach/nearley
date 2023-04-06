// Node-only

var Writable = require('stream').Writable;
var util = require('util');

function StreamWrapper(parser) {
    Writable.call(this);
    this._parser = parser;
}

util.inherits(StreamWrapper, Writable);


var tailPrevChunk='';
StreamWrapper.prototype._write = function write(chunk, encoding, callback) {
    //https://github.com/kach/nearley/issues/632
    //Token might be span multiple chunks. 
    var chunkString = chunk.toString();
    var idxLastNewline = chunkString.lastIndexOf('\n');
    if (idxLastNewline === -1 ){
        tailPrevChunk += chunkString;
        return;
    }

    var alteredChunk = tailPrevChunk + chunkString.substring(0,idxLastNewline);
    tailPrevChunk= chunkString.substring(idxLastNewline);

    this._parser.feed(alteredChunk);
    callback();
};

module.exports = StreamWrapper;
