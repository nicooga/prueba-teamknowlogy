const fs = require('fs')
const path = require('path')
const juice = require('juice')
const sass = require('node-sass')
const pug = require('pug')

const templateRootDir = templateName => path.join(__dirname, '..', 'emails', templateName)

const getCompiledTemplate = rootDir => {
  const p = path.join(rootDir, 'email.html.pug')
  return pug.compileFile(p)
}

const getRawStylesheet = rootDir => {
  const p = path.join(rootDir, 'style.scss')
  return fs.readFileSync(p, { encoding: 'utf8' })
}

// Higher order function that returns a function that
// reads a image relative to <root>/emails/<templateName>/images
// and returns it as an HTML/CSS embedable base64 string.
const buildImageReader = rootDir => {
  const imagesDir = path.join(rootDir, 'images')

  return name => {
    const p = path.join(imagesDir, name)
    const image = fs.readFileSync(p, { encoding: 'base64' })
    return 'data:image/png;base64,' + image
  }
}

// Handles inlining of CSS and injection of images as base64 strings.
//
// Assumes the given estructure for each email template:
// there is a folder in <root>/emails/<templateName>,
// which has a email.html file, a style.scss file and an images folder.
//
// A function called `base64ImageUrl` is provided both to SASS
// and Pug compilers in order to interpolate image urls.
const EmailTemplate = {
  dumpToString(templateName, locals = {}) {
    const rootDir = templateRootDir(templateName)

    const template = getCompiledTemplate(rootDir)
    const rawStylesheet = getRawStylesheet(rootDir)
    const base64ImageUrl = buildImageReader(rootDir)

    const style = sass.renderSync({
      data: rawStylesheet,
      functions: { 'base64ImageUrl($path)': base64ImageUrl }
    }).css.toString()

    const body = template({ base64ImageUrl, ...locals })

    // juice transforms the CSS in the style tag into inline CSS
    return juice(`
      <style>${style}</style>
      <body>${body}</body>
    `)
  }
}

module.exports = EmailTemplate
