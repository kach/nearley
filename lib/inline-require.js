var fs = require('fs');

module.exports = function inlineRequire(req, module) {
    return "(function () {\n" +
        "    var module = {exports: {}};\n" +
        "    (function (module) {\n" +
        fs.readFileSync(req.resolve(module)).toString().replace(/^/gm, '        ') + "\n" +
        "    })(module, module.exports);\n" +
        "    return module.exports;\n" +
        "})();";
};
