const fs = require('fs')
const path = require('path')
const juice = require('juice')
const sass = require('node-sass')
const pug = require('pug')

const ASSET_HOST = process.env.MAILER_ASSET_HOST || 'http://localhost:3000'

const templateRootDir = templateName => path.join(__dirname, '..', 'emails', templateName)

const getCompiledTemplate = rootDir => {
  const p = path.join(rootDir, 'email.html.pug')
  return pug.compileFile(p)
}

const getRawStylesheet = rootDir => {
  const p = path.join(rootDir, 'style.scss')
  return fs.readFileSync(p, { encoding: 'utf8' })
}

const buildAssetUrlFinder = templateName => assetName => path.join(ASSET_HOST, 'email-assets', templateName, assetName)

// Assumes the given estructure for each email template:
// there is a folder in <root>/emails/<templateName>,
// which has a email.html file, a style.scss file and an assets folder.
//
// A function `assetUrl` is provided both to SASS
// and Pug compilers in order to interpolate image urls.
const EmailTemplate = {
  dumpToString(templateName, locals = {}) {
    const rootDir = templateRootDir(templateName)

    const template = getCompiledTemplate(rootDir)
    const rawStylesheet = getRawStylesheet(rootDir)
    const assetUrl = buildAssetUrlFinder(templateName)

    const style = sass.renderSync({
      data: rawStylesheet,
      functions: { assetUrl }
    }).css.toString()

    const body = template({ assetUrl, ...locals })

    // juice transforms the CSS in the style tag into inline CSS
    return juice(`
      <style>${style}</style>
      <body>${body}</body>
    `)
  }
}

module.exports = EmailTemplate
