module.exports = function serialize(obj) {
    if (Array.isArray(obj)) {
        return '[' + obj.map(serialize).join(', ') + ']';
    } else if (obj instanceof RegExp || typeof obj == 'function') {
        return obj.toString();
    } else if (typeof obj == 'object') {
        return '{' + Object.keys(obj).map(function (e) {
            return JSON.stringify(e) + ": " + serialize(obj[e]);
        }).join(', ') + '}';
    } else {
        return JSON.stringify(obj);
    }
};
