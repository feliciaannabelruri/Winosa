// Contact Form Email Template (to Admin)
exports.contactFormTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .info-row {
          margin: 15px 0;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 4px solid #4CAF50;
        }
        .label {
          font-weight: bold;
          color: #4CAF50;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <p>You have received a new message from your website contact form:</p>
          
          <div class="info-row">
            <span class="label">Name:</span><br/>
            ${data.name}
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span><br/>
            ${data.email}
          </div>
          
          ${data.subject ? `
          <div class="info-row">
            <span class="label">Subject:</span><br/>
            ${data.subject}
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">Message:</span><br/>
            ${data.message}
          </div>
          
          <div class="info-row">
            <span class="label">Received:</span><br/>
            ${new Date().toLocaleString()}
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from Winosa Contact Form</p>
          <p>© ${new Date().getFullYear()} Winosa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Newsletter Subscription Confirmation (to Subscriber)
exports.newsletterWelcomeTemplate = (email, lang = 'en') => {
  const translations = {
    en: {
      title: '🎉 Welcome to Winosa Newsletter!',
      greeting: 'Hello there!',
      message: 'Thank you for subscribing to our newsletter. You\'re now part of our community!',
      whatToExpect: 'What to expect:',
      updates: '📰 Latest updates and news',
      tips: '💡 Helpful tips and insights',
      exclusive: '🎁 Exclusive offers and content',
      unsubscribe: 'You can unsubscribe at any time.',
      footer: 'This email was sent because you subscribed to Winosa Newsletter'
    },
    id: {
      title: '🎉 Selamat Datang di Newsletter Winosa!',
      greeting: 'Halo!',
      message: 'Terima kasih telah berlangganan newsletter kami. Anda sekarang menjadi bagian dari komunitas kami!',
      whatToExpect: 'Yang akan Anda dapatkan:',
      updates: '📰 Update dan berita terbaru',
      tips: '💡 Tips dan wawasan bermanfaat',
      exclusive: '🎁 Penawaran dan konten eksklusif',
      unsubscribe: 'Anda dapat berhenti berlangganan kapan saja.',
      footer: 'Email ini dikirim karena Anda berlangganan Newsletter Winosa'
    },
    nl: {
      title: '🎉 Welkom bij Winosa Nieuwsbrief!',
      greeting: 'Hallo!',
      message: 'Bedankt voor het abonneren op onze nieuwsbrief. Je maakt nu deel uit van onze gemeenschap!',
      whatToExpect: 'Wat te verwachten:',
      updates: '📰 Laatste updates en nieuws',
      tips: '💡 Nuttige tips en inzichten',
      exclusive: '🎁 Exclusieve aanbiedingen en inhoud',
      unsubscribe: 'Je kunt je op elk moment afmelden.',
      footer: 'Deze e-mail is verzonden omdat je je hebt geabonneerd op Winosa Nieuwsbrief'
    }
  };

  const t = translations[lang] || translations.en;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
        }
        .header {
          background-color: #2196F3;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .feature {
          padding: 15px;
          margin: 10px 0;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${t.title}</h1>
        </div>
        <div class="content">
          <p><strong>${t.greeting}</strong></p>
          <p>${t.message}</p>
          
          <h3>${t.whatToExpect}</h3>
          <div class="feature">${t.updates}</div>
          <div class="feature">${t.tips}</div>
          <div class="feature">${t.exclusive}</div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            ${t.unsubscribe}
          </p>
        </div>
        <div class="footer">
          <p>${t.footer}</p>
          <p>© ${new Date().getFullYear()} Winosa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Newsletter Notification to Admin
exports.newsletterAdminTemplate = (email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
        }
        .header {
          background-color: #FF9800;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .info {
          background-color: #fff3cd;
          padding: 15px;
          border-left: 4px solid #FF9800;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Newsletter Subscriber</h1>
        </div>
        <div class="content">
          <p>A new user has subscribed to your newsletter!</p>
          
          <div class="info">
            <strong>Email:</strong> ${email}<br/>
            <strong>Subscribed:</strong> ${new Date().toLocaleString()}
          </div>
          
          <p>Total subscribers can be viewed in your admin dashboard.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};