const admin = require('firebase-admin');

console.log('1️⃣ Starting setup...');

// Initialize Firebase Admin
try {
  const serviceAccount = require('./firebase-key.json');
  console.log('2️⃣ Firebase key loaded');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'muka-tenders'
  });
  console.log('3️⃣ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase init error:', error.message);
  process.exit(1);
}

const db = admin.firestore();
console.log('4️⃣ Firestore connected');

async function setupFirestore() {
  try {
    console.log('5️⃣ Starting collections...\n');

    // Create tenders collection
    console.log('📋 Creating tenders...');
    await db.collection('tenders').doc('SAMPLE-001').set({
      internal_number: 'INT-001',
      timestamp: admin.firestore.Timestamp.now(),
      organization: 'US Embassy',
      location_country: 'Brazil',
      rfq_number: 'RFQ-2026-001',
      items_requested: 5,
      due_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      assigned_to: 'info@mukatrade.com',
      status: 'sourcing',
      priority: 'orange',
      agent_assigned: 'Agent 1',
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now()
    });
    console.log('✅ tenders created');

    console.log('📁 Creating sourcing_files...');
    await db.collection('sourcing_files').doc('SAMPLE-001').set({
      internal_number: 'INT-001',
      timestamp: admin.firestore.Timestamp.now(),
      organization: 'US Embassy',
      rfq_number: 'RFQ-2026-001',
      sourcing_file_url: '',
      comparison_file_url: '',
      status: 'draft',
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now()
    });
    console.log('✅ sourcing_files created');

    console.log('📌 Creating follow_ups...');
    await db.collection('follow_ups').doc('SAMPLE-001').set({
      internal_number: 'INT-001',
      action: 'Contact suppliers for quotes',
      due_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
      status: 'pending',
      assigned_to: 'info@mukatrade.com',
      created_at: admin.firestore.Timestamp.now()
    });
    console.log('✅ follow_ups created');

    console.log('👤 Creating users...');
    await db.collection('users').doc('info@mukatrade.com').set({
      email: 'info@mukatrade.com',
      role: 'admin',
      display_name: 'Admin User',
      created_at: admin.firestore.Timestamp.now()
    });
    console.log('✅ users created');

    console.log('📄 Creating documents...');
    await db.collection('documents').doc('SAMPLE-001').set({
      internal_number: 'INT-001',
      document_name: 'Sample Document',
      document_url: '',
      google_drive_link: '',
      document_type: 'tender',
      created_at: admin.firestore.Timestamp.now()
    });
    console.log('✅ documents created');

    console.log('🤖 Creating agent_logs...');
    await db.collection('agent_logs').doc('SAMPLE-001').set({
      agent_name: 'SCRAPER',
      action: 'INITIALIZED',
      status: 'success',
      details: 'Setup complete',
      timestamp: admin.firestore.Timestamp.now()
    });
    console.log('✅ agent_logs created');

    console.log('\n✨ All done! Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
}

setupFirestore();