import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 */
connectDB = () => {
const dbURI = process.env.DB_URI;

  // Connect to MongoDB using Mongoose
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit process with failure
    });
}

// Load environment variables from .env file
require('dotenv').config();

// Call the connectDB function to initiate the database connection
connectDB();
export {"default":"connectDB"};
