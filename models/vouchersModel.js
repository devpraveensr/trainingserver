const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const VouchersSchema = new Schema({
  
  training_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Please select a training']
  },
  course_provider_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Please select a course provider'],
  },
  voucher_code: {
    type: String,
    required: [true, 'Please enter a voucher code']
  },
  assigned_status: {
    type: Boolean,
    default: false
  },
  purchase_date: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  expiry_date: {
    type: Date,
    required: [true, 'Expiry date is required']
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

module.exports = mongoose.model('Vouchers', VouchersSchema);