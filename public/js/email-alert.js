const nodemailer = require('nodemailer');
const { dialog } = require('electron').remote;

// Function to send an email alert
async function sendEmailAlert(subject, message, recipient) {
  // Load the company profile to get the email settings
  const companyProfile = await getCompanyProfile();

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: companyProfile.smtpHost,
    port: companyProfile.smtpPort,
    secure: companyProfile.smtpSecure, // true for 465, false for other ports
    auth: {
      user: companyProfile.smtpUsername,
      pass: companyProfile.smtpPassword,
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"ThermWatch Alert" <${companyProfile.smtpUsername}>`, // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: `<b>${message}</b>`, // html body
  });

  console.log('Message sent: %s', info.messageId);

  // Show a dialog to inform the user that an email has been sent
  dialog.showMessageBox({
    type: 'info',
    title: 'Email Alert Sent',
    message: `An email alert has been sent to ${recipient}.`,
  });
}

// Function to get the company profile from the database
async function getCompanyProfile() {
  // Assuming there is a function in 'scripts/database.js' to get company profile
  try {
    const companyProfile = await getCompanyData();
    return companyProfile;
  } catch (error) {
    console.error('Error fetching company profile for email alert:', error);
    throw error;
  }
}

module.exports = {
  sendEmailAlert,
};