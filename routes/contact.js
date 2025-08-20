const router = require('express').Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// POST /api/contact - Create a contact message (no auth)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const doc = await ContactMessage.create({ name, email, phone, subject, message });

    // Optional email notification using Gmail SMTP via .env
    const { EMAIL_USER, EMAIL_PASS, EMAIL_FROM, EMAIL_HOST, EMAIL_PORT } = process.env;
    if (EMAIL_USER && EMAIL_PASS && EMAIL_HOST && EMAIL_PORT) {
      try {
        const transporter = nodemailer.createTransport({
          host: EMAIL_HOST,
          port: Number(EMAIL_PORT),
          secure: false,
          auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        });

        await transporter.sendMail({
          from: EMAIL_FROM || EMAIL_USER,
          to: EMAIL_FROM || EMAIL_USER,
          subject: `[Contact] ${subject} - ${name}`,
          text: `New contact message\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
        });
      } catch (mailErr) {
        console.warn('Email send failed:', mailErr.message);
      }
    }

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('POST /contact error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;