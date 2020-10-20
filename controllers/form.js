const { sendEmailWithNodemailer } = require('../helpers/email');

exports.contactForm = (req, res) => {
  const { email, name, message } = req.body;

  const emailData = {
    to: process.env.EMAIL_TO,
    from: email,
    subject: `Contact from - ${process.env.APP_NAME}`,
    text: `
    Email received from contact from
    Sender name: ${name}
    Sender email: ${email}
    Sender message:${message}`,
    html: `
    <h4>Email received form contact form</h4>
    <p>Sender name: ${name}</p>
    <p>Sender email: ${email}</p>
    <p>Sender message: ${message}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://strataroofing.com.au</p>
    `,
  };

  sendEmailWithNodemailer(req, res, emailData);
};
