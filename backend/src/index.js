const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const Mailer = require('./Mailer')
const EmailTemplate = require('./EmailTemplate')

const app = express()

const html = EmailTemplate.dumpToString('account_validation_email', { email: '2112.oga@gmail.com' })
fs.promises.writeFile('test.html', html, { flag: 'w' })

app.use(cors())
app.use(bodyParser.json())

Mailer.createTransport()

app.post('/send-account-validation-email', async (req, res) => {
  const { email } = req.body

  const html = EmailTemplate.dumpToString('account_validation_email', { email })

  await Mailer.sendMail({
    subject: 'Validate your account',
    to: email,
    html
  })

  console.log(`>>> Sent email to ${email}`)

  res.status(200).send()
})

app.get('/email-assets/:templateName/:assetName', async (req, res) => {
  const { templateName, assetName } = req.params
  const filePath = path.join(__dirname, '..', 'emails', templateName, 'assets', assetName)
  res.sendFile(filePath)
})

app.listen(3000)
