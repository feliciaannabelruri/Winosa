const transporter = require('../config/email');

const sendEmail = async (options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        // Add text fallback
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      };

      const info = await transporter.sendMail(mailOptions);

      console.log(`✅ Email sent to ${options.to}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Attempt ${i + 1} - Email send error:`, error.message);
      
      if (i === retries - 1) {
        // Last attempt failed
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }
      
      // Wait before retry (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

module.exports = sendEmail;