import mongoose from 'mongoose';

/**
 * Defines the schema for the User model with fields for username, email, password, and createdAt timestamp.
 */
userSchema = () => {
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
}

/**
 * Creates a Mongoose model for the User schema.
 */
User = () => {
const User = mongoose.model('User', userSchema);
}

/**
 * Exports the User model for use in other parts of the application.
 */
module.exports = () => {
module.exports = User;
}

// User model schema for TaskManager application
// This model is used to interact with the users collection in MongoDB.
// It includes validation for username, email, and password fields.
export {"default":"User"};
