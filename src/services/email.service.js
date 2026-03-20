const nodemailer = require('nodemailer');

// Authenticates with Google's SMTP server using OAuth2 and 
// creates a transporter object for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
// Confirms the connection is live on server start 
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
})

module.exports = {transporter};
// Function to send email
// The engine that pushes that 
// content through the authenticated transporter
const sendEmail = async (to, subject, text, html) => {
    try {
      const info = await transporter.sendMail({
        from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
// Creates the specific "Welcome" content for a new user 
// and calls the sendEmail function to dispatch it
async function SendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for 
    registering with Backend Ledger! We're excited to have you on board.
    \n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p>
    <p>Thank you for registering with Backend Ledger! We're excited to have you on board.</p>`
   
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount){
  const subject = 'Transaction Alert from Backend Ledger';
  const text = `Hello ${name}, \n\n Your transaction of ${amount} to account ${toAccount} was successful. \n\nBest regards,\n The Backend Ledger Team`;
  const html = `<p>Hello ${name}, </p><p>Your transaction of ${amount} to account ${toAccount} was successful. </p><p> Best Regards, <br> The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount){
  const subject = 'Transaction Failure Alert from Backend Ledger';
  const text = `Hello ${name}, \n\n Your transaction of ${amount} to account ${toAccount} has failed. Please check your account balance and try again. \n\nBest regards,\n The Backend Ledger Team`;
  const html = `<p>Hello ${name}, </p><p>Your transaction of ${amount} to account ${toAccount} has failed. Please check your account balance and try again. </p><p> Best Regards, <br> The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}


  module.exports =  {   SendRegistrationEmail,
                        sendTransactionEmail, 
                        sendTransactionFailureEmail
   };

