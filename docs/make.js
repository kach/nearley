
const fs = require("fs")

const Metalsmith = require("metalsmith")
const { default: markdown } = require("metalsmith-github-markdown")
const layouts = require("metalsmith-layouts")
const paths = require("metalsmith-paths")
const cheerio = require("cheerio")
const { extname } = require("path")

const Handlebars = require("handlebars")
Handlebars.registerHelper("eq", (a, b) => a === b)

/*
const debug = (files, metalsmith, done) => {
  setImmediate(done)
}
*/

const docs = articles => (files, metalsmith, done) => {
  setImmediate(done)
  Object.assign(metalsmith.metadata(), {
    docs: articles.map(name => {
      const f = files[name + ".md"]
      f.isDoc = true
      return f
    })
  })
}

function headings(files, metalsmith, done) {
  setImmediate(done)
  Object.keys(files).forEach(function(file) {
    if (".html" !== extname(file)) return
    var data = files[file]
    var contents = data.contents.toString()
    var $ = cheerio.load(contents)
    data.headings = []

    $("h3").each(function() {
      let id
      $(this)
        .find("a.anchor")
        .attr("id", (i, attr) => (id = /user-content-(.*)/.exec(attr)[1]))
        .remove()
      $(this).attr("id", id)
      data.headings.push({
        id,
        text: $(this).text()
      })
    })
    data.contents = Buffer.from($.html())
  })
}

Metalsmith(__dirname)
  .metadata({
    version: require("../package.json").version,
    css: fs.readFileSync("../www/main.css", "utf-8"),
  })
  .source("md/")
  .destination(".")
  .clean(false)
  .use(paths({
    property: "paths",
  }))
  .use(docs([

    "index",
    "getting-started",
    "grammar",
    "parser",
    "tokenizers",
    "tooling",
    "how-to-grammar-good",
    "using-in-frontend",
    "glossary",

  ]))
  //.use(debug)
  .use(markdown({
      // accessToken: "github oauth token goes here if being rate-limited"
  }))
  .use(headings)
  .use(layouts({
    engine: "handlebars",
    default: "template.html",
  }))
  .build(function(err) {
    if (err) throw err
  })
