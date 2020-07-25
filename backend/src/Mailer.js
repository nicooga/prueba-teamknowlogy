const nodemailer = require('nodemailer')

const DEFAULT_SENDER = 'text@example.com'

let transport

const createDummyEtherealAccount = async _ => {
  const { user, pass } = await nodemailer.createTestAccount()

  console.log(`
===

Using test ethereal.email account.
To see catched emails login at https://ethereal.email/login with following credentials:

email address: ${user}
password: ${pass}

... then go to https://ethereal.email/messages.

===
  `)

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user, pass },
  })
}

const createTransport = async _ => {
  const {
    MAILER_SMTP_HOST: host,
    MAILER_SMTP_PORT: port,
    MAILER_SMTP_USER: user,
    MAILER_SMTP_PASSWORD: pass,
  } = process.env

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    })
  }

  return createDummyEtherealAccount()
}

const getTransport = async _ => {
  if (!transport) { transport = createTransport() }
  return await transport
}

const sendMail = async options => {
  const transport = await getTransport()

  return await transport.sendMail({
    from: DEFAULT_SENDER,
    ...options
  })
}

const Mailer = { createTransport, sendMail }

module.exports = Mailer
