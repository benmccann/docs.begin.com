let arc = require('@architect/functions')
let cssmitten = require('cssmitten')
let postcss = require('postcss')
let simpleExtend = require('postcss-extend')
let fs = require('fs')
let path = require('path')
let read = fs.readFileSync

// Set up cssmitten with our modular scales and style config
let config = read(path.join(__dirname, '/_config.json')).toString()
let styleguide = cssmitten(config)

// App CSS is used to manually define all styles specific to this particular app
let app = read(path.join(__dirname, '/_app.css')).toString()

// Extend (via postcss-extend) our standardized styles to the vanilla markup generated by our app's markdown generator
let extend = read(path.join(__dirname, '/_extend.css')).toString()

// Style up those code blocks all pretty like
let prism = read(path.join(__dirname, '/_prism.css')).toString()

// Not used, but kept for reference in this directory: _styleguide.css (needs to be updated periodically as things change)

function createCss () {
  return app + '\n\n' + prism + '\n\n' + extend + '\n\n' + styleguide
}

var css = postcss()
  .use(simpleExtend())
  .process(createCss())
  .css

function route(req, res) {
  res({
    css: css
  })
}

exports.handler = arc.http(route)
