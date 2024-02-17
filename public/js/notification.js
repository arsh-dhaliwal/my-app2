const { Notification } = require('electron');

function sendNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
    icon: 'assets/icons/icon.ico'
  });
  notification.show();
}

function sendEmailAlert(email, subject, message) {
  // This function would ideally use an email sending service or SMTP server.
  // For the purpose of this example, we'll log the action to the console.
  // In a real-world scenario, you would replace this with actual email sending logic.
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  // Here you would use a library like nodemailer to send the email.
}

module.exports = {
  sendNotification,
  sendEmailAlert
};