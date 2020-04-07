/** Express service for Emailing
 * @module services/mailer
 * @requires express
 */

/**
 * nodemailer module
 * Nodemailer is used to send emails
 * @const
 */
const nodemailer = require('nodemailer')

/**
 * Class representing mailer service used to send emails to users.
 */
class mailerService {
  // Constructor with dependency injection
  /**
   * Constructs the mailer service
   * @constructor
   * @param {*} nodemailer
   * @param {*} crypto
   */
  constructor (nodemailer, crypto) {
    this.nodemailer = nodemailer
    this.crypto = crypto
  }

  /**
   * Sends the reset password email to the user.
   * @function
   * @param {String} Receiver - The receiver of the mail
   * @param {String} Subject - The subject of the mail
   * @param {String} Text - The text of the mail
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
