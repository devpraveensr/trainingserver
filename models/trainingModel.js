const mongoose = require('mongoose');
const Training_Providers = require('./trainingProvidersModel')
const Schema = mongoose.Schema;

const TrainingSchema = new Schema({

  training_title: {
    type: String,
    required: true
  },
  training_description: {
    type: String,
    required: true
  },
  course_provider: {
    type: mongoose.Schema.ObjectId,
    ref: Training_Providers,
    required: [true, 'Training provider is required']
  },
  training_link: {
    type: String,
    required: true,
    match: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  },
  objectives: [String],
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
})

TrainingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'course_provider',
    model: Training_Providers,
    select: 'course_provider'
  });
  next();
})


module.exports = mongoose.model('Training', TrainingSchema);