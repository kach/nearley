
const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
//const headings = require('metalsmith-headings')
const layouts = require('metalsmith-layouts')
//const navigation = require('metalsmith-navigation')


const nearleyPackage = require('../package.json')

Metalsmith(__dirname)
  .metadata({
    version: nearleyPackage.version,
  })
  .source('md/')
  .destination('.')
  .clean(false)
  .use(markdown({
    smartypants: true,
    gfm: true,
  }))
  .use(layouts({
    engine: 'handlebars',
    default: 'template.html',
  }))
  .build(function(err) {
    if (err) throw err;
  });
