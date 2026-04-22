const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'info@winosa.id',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      });

      if (error) throw new Error(error.message);

      console.log(`Email sent to ${options.to}:`, data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error(`Attempt ${i + 1} - Email send error:`, error.message);

      if (i === retries - 1) {
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

module.exports = sendEmail;