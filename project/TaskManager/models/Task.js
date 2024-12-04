import mongoose from 'mongoose';

/**
 * Defines the schema for the Task model, including fields for title, description, completed status, and timestamps.
 */
taskSchema = () => {
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field before saving

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
}

/**
 * Creates the Task model based on the defined schema.
 */
Task = () => {
const Task = mongoose.model('Task', taskSchema);
}

// Export the Task model for use in other parts of the application
module.exports = Task;
export {"default":"Task"};
