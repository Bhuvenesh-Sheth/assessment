const axios = require('axios');
const mongoose = require('mongoose');
const ProductTransaction = require('./ProductTransaction');

const MONGO_URI = 'your_mongodb_atlas_connection_string';

const fetchAndSeedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch data from third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Seed the database
    await ProductTransaction.deleteMany({});
    await ProductTransaction.insertMany(transactions);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
  }
};

fetchAndSeedData();
