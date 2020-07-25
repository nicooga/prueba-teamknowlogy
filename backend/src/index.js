const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const Mailer = require('./Mailer')
const EmailTemplate = require('./EmailTemplate')

const app = express()

// TODO: REMOVE THIS BEFORE COMMIT
const fs = require('fs')
const html = EmailTemplate.dumpToString('account_validation_email', { email: '2112.oga@gmail.com' })
fs.promises.writeFile('test.html', html, { flag: 'w' })
  .then(_ => console.log('>>> Wrote email to test.html'))
// END TODO

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

  res.status(200).send()
})

app.listen(3000)
