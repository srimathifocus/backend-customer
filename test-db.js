require('dotenv').config();
const mongoose = require('mongoose');
const ContactMessage = require('./models/ContactMessage');
const DemoRequest = require('./models/DemoRequest');

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');

    // Create a test contact message
    const testContact = await ContactMessage.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      subject: 'Test Contact',
      message: 'This is a test contact message to verify database connection.'
    });
    console.log('✅ Test contact message created:', testContact._id);

    // Create a test demo request
    const testDemo = await DemoRequest.create({
      name: 'Demo User',
      business: 'Test Business Ltd',
      phone: '9876543210',
      email: 'demo@example.com',
      businessType: 'retail-store',
      currentSoftware: 'excel',
      preferredTime: '2:00 PM'
    });
    console.log('✅ Test demo request created:', testDemo._id);

    // List all records to verify
    const contacts = await ContactMessage.find().limit(5);
    const demos = await DemoRequest.find().limit(5);
    
    console.log('\n📋 Recent Contact Messages:', contacts.length);
    contacts.forEach(c => console.log(`  - ${c.name} (${c.email}): ${c.subject}`));
    
    console.log('\n📋 Recent Demo Requests:', demos.length);
    demos.forEach(d => console.log(`  - ${d.name} from ${d.business} (${d.preferredTime})`));

    console.log('\n✅ Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();