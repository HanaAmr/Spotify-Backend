/** Express service for Email
 * @module services/mailer
 * @requires express
 */

/**
 * express module
 * Nodemailer to send emails
 * @const
 */
const nodemailer = require('nodemailer')


/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError')

class mailerService {
  // Constructor with dependency injection
  constructor (nodemailer, crypto) {
    this.nodemailer = nodemailer
    this.crypto = crypto
  }

  /**
   * A function that is used to send the reset password email to the user.
   * @memberof module:controllers/users~userController
   * @param {Receiver}  - The receiver of the mail
   * @param {Subject}  - The subject of the mail
   * @param {Text}  - The text of the mail
   */
  async sendMail (receiver, subject, text) {
    // Creating transporting method for nodemailer
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAILUSR,
        pass: process.env.GMAILPW
      }
    })
    // Creating the mail to send
    const mailOptions = {
      to: receiver,
      from: process.env.GMAILUSR,
      subject: subject,
      text: text
    }
    // Sending the email
    await smtpTransport.sendMail(mailOptions)
  }
}

module.exports = mailerService
