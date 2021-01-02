const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  
  role: {
    type: String,
    required: [true, 'Role is required'],
    lowercase: true,
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

module.exports = mongoose.model('Roles', RolesSchema);