const mongoose = require('mongoose');
const validator = require('validator');
const Trainings = require('./trainingModel');
const TrainingProvider = require('./trainingProvidersModel');
const Vouchers = require('./vouchersModel');
const Users = require('./userModel');
const Schema = mongoose.Schema;

const AssignVouchersSchema = new Schema({
  
  training_id: {
    type: mongoose.Schema.ObjectId,
    ref: Trainings,
    required: [true, 'Please select a training'],
    validate: {
      validator: async (el) => {
        return !!await Trainings.findOne({_id: el})
      }, message: 'Please provide a valid training'
    }
  },
  course_provider_id: {
    type: mongoose.Schema.ObjectId,
    ref: TrainingProvider,
    required: [true, 'Please select a course provider'],
    validate: {
      validator: async (el) => {
        return !!await TrainingProvider.findOne({_id: el})
      }, message: 'Please provide a valid course provider'
    }
  },
  voucher_id: {
    type: mongoose.Schema.ObjectId,
    ref: Vouchers,
    required: [true, 'Please select a voucher'],
    validate: {
      validator: async (el) => {
        return !!await Vouchers.findOne({_id: el})
      }, message: 'Please provide a valid voucher'
    }
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: Users,
    required: [true, 'Please select a user'],
    validate: {
      validator: async (el) => {
        return !!await Users.findOne({_id: el})
      }, message: 'Please provide a valid user'
    }
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

module.exports = mongoose.model('Assigned_Voucher', AssignVouchersSchema);