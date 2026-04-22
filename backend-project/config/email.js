const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'info@winosa.id',
      to,
      subject,
      html,
    });

    if (error) {
      console.log('Email error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.log('Email configuration error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;