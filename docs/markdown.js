const { basename, dirname, extname } = require("path");
const marked = require("marked");
const gfmSyntax = require("github-markdown-syntax");

const isMarkdown = file => /\.md|\.markdown/.test(extname(file));

const toHighlight = [];
const highlight = (code, lang, cb) => {
  const len = toHighlight.push({ code, lang, cb });
  setImmediate(async () => {
    if (len === toHighlight.length) {
      const results = await gfmSyntax(toHighlight);
      results.forEach((res, i) => {
        toHighlight[i].cb(null, res);
      });
    }
  });
};

const options = { gfm: true, smartypants: true, highlight };

module.exports = plugin;

function plugin(files, metalsmith, done) {
  Promise.all(
    Object.entries(files).map(async ([file, data]) => {
      if (!isMarkdown(file)) return;
      const dir = dirname(file);
      let html = basename(file, extname(file)) + ".html";
      if ("." != dir) html = dir + "/" + html;
      
      const str = await new Promise(res =>
        marked(data.contents.toString(), options, (err, out) => {
          if (err instanceof Error) return rej(err);
          if (typeof err === "string") {
            out = err;
          }
          res(out);
        })
      );
      data.contents = Buffer.from(str);

      delete files[file];
      files[html] = data;
    })
  ).then(() => {
    done();
  });
}
