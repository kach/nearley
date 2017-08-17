const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const headings = require('metalsmith-headings')
const layouts = require('metalsmith-layouts')
const collections = require('metalsmith-collections')
const paths = require('metalsmith-paths')

const Handlebars = require('handlebars')
Handlebars.registerHelper('eq', (a, b) => a === b)

/*
const debug = (files, metalsmith, done) => {
  setImmediate(done)
  console.log(metalsmith.metadata().collections.articles)
  console.log(metalsmith.metadata().collections.articles[0].paths)
}
*/

Metalsmith(__dirname)
  .metadata({
    version: require('../package.json').version,
  })
  .source('md/')
  .destination('.')
  .clean(false)
  .use(paths({
    property: 'paths'
  }))
  .use(collections({
    docs: '*.md',
    sortBy: 'title',
  }))
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

