
const fs = require('fs')

const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const headings = require('metalsmith-headings')
const layouts = require('metalsmith-layouts')
const paths = require('metalsmith-paths')

const Handlebars = require('handlebars')
Handlebars.registerHelper('eq', (a, b) => a === b)

/*
const debug = (files, metalsmith, done) => {
  setImmediate(done)
}
*/

const docs = articles => (files, metalsmith, done) => {
  setImmediate(done)
  Object.assign(metalsmith.metadata(), {
    docs: articles.map(name => {
      const f = files[name + '.md']
      f.isDoc = true
      return f
    }),
  })
}

Metalsmith(__dirname)
  .metadata({
    version: require('../package.json').version,
    css: fs.readFileSync('../www/main.css', 'utf-8'),
  })
  .source('md/')
  .destination('.')
  .clean(false)
  .use(paths({
    property: 'paths'
  }))
  .use(docs([

    'getting-started',
    'grammar',
    'parser',
    'tokenizers',
    'tooling',
    'how-to-grammar-good',
    'using-in-frontend',
    'glossary',

  ]))
  //.use(debug)
  .use(markdown({
    smartypants: true,
    gfm: true,
  }))
  .use(headings('h3'))
  .use(layouts({
    engine: 'handlebars',
    default: 'template.html',
  }))
  .build(function(err) {
    if (err) throw err;
  })

