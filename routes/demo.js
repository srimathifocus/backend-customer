const router = require('express').Router();
const nodemailer = require('nodemailer');
const DemoRequest = require('../models/DemoRequest');

// POST /api/demo - Create a demo request (no auth)
router.post('/demo', async (req, res) => {
  try {
    const { name, business, phone, email, businessType, currentSoftware, preferredTime } = req.body;

    if (!name || !business || !phone || !email || !businessType || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const doc = await DemoRequest.create({
      name,
      business,
      phone,
      email,
      businessType,
      currentSoftware,
      preferredTime,
    });

    // Optional email notification
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
          subject: `[Demo] ${name} from ${business} (${preferredTime})`,
          text: `New demo request\nName: ${name}\nBusiness: ${business}\nPhone: ${phone}\nEmail: ${email}\nBusiness Type: ${businessType}\nCurrent Software: ${currentSoftware || 'N/A'}\nPreferred Time: ${preferredTime}`,
        });
      } catch (mailErr) {
        console.warn('Email send failed:', mailErr.message);
      }
    }

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('POST /demo error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;