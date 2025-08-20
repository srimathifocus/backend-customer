const mongoose = require('mongoose');

const DemoRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    business: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    businessType: { type: String, required: true },
    currentSoftware: { type: String },
    preferredTime: { type: String, required: true },
    meta: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DemoRequest', DemoRequestSchema);