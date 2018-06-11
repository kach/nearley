const { basename, dirname, extname } = require("path");
const marked = require("marked");
const gfmSyntax = require("github-markdown-syntax");

const isMarkdown = file => /\.md|\.markdown/.test(extname(file));

const toHighlight = [];
const highlight = (code, lang, cb) => {
  const len = toHighlight.push({ code, lang, cb });
  setImmediate(() => {
    if (len === toHighlight.length) {
      gfmSyntax(toHighlight).then(results => {
        results.forEach((res, i) => {
          toHighlight[i].cb(null, res);
        });
      });
    }
  });
};

const options = { gfm: true, smartypants: true, highlight };

module.exports = plugin;

function plugin(files, metalsmith, done) {
  Promise.all(
    Object.keys(files).map(file => {
      let data = files[file];
      if (!isMarkdown(file)) return;
      const dir = dirname(file);
      let html = basename(file, extname(file)) + ".html";
      if ("." != dir) html = dir + "/" + html;

      return new Promise((res, rej) => {
        marked(data.contents.toString(), options, (err, out) => {
          if (err instanceof Error) return rej(err);
          if (typeof err === "string") out = err;

          data.contents = Buffer.from(out);

          delete files[file];
          files[html] = data;
          res();
        });
      });
    })
  ).then(() => {
    done();
  });
}
