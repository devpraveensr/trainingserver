const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainingProvidersSchema = new Schema({
  
  course_provider: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  modified_date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Training_Provider', TrainingProvidersSchema);