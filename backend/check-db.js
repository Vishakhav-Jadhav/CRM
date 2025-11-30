const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/crm');
    console.log('Connected to MongoDB');

    const collections = ['users', 'contacts', 'companies', 'opportunities', 'activities', 'expenses'];

    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col).countDocuments();
      console.log(`${col}: ${count} documents`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDB();