module.exports = function serialize(obj) {
    if (Array.isArray(obj)) {
        return '[' + obj.map(serialize).join(', ') + ']';
    } else if (obj instanceof RegExp || typeof obj == 'function') {
        return obj.toString();
    } else if (typeof obj == 'object') {
        return '{' + Object.keys(obj).map(function (e) {
            return obj[e] === void 0 ? obj[e] : JSON.stringify(e) + ": " + serialize(obj[e]);
        }).filter(id).join(', ') + '}';
    } else {
        return JSON.stringify(obj);
    }

    function id(e) { return e; }
};
