const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Roles = require('./rolesModel');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  password_confirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password
      }, message: 'Passwords dont match'
    }
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: Roles,
    required: [true, 'Role is required'],
    validate: {
      validator: async (el) => {
        return !!await Roles.findOne({_id: el})
      }, message: 'Please provide a valid role'
    }
  },
  last_login: Date,
  notification_status: Boolean,
  token: String,
  created_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  modified_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  passwordModifiedAt: Date
})

UserSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'role',
    model: Roles,
    select: 'role'
  });
  next();
})

UserSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password =  await bcrypt.hash(this.password, salt);
  this.password_confirm = undefined;
  next();
})

UserSchema.pre('save', async function(next) {
  await this.populate({
    path: 'role',
    model: Roles,
    select: 'role'
  }).execPopulate();
  next()
})


UserSchema.methods.passCompare = async function(incomingPassword, savedPassword) {
  return await bcrypt.compare(incomingPassword, savedPassword);
}


UserSchema.methods.passChangeAfterToken = function(JWTTimeStamp) {
  if(this.passwordModifiedAt) {
    passwordModifiedTimeStamp = parseInt(this.passwordModifiedAt.getTime() / 1000, 10);
    return JWTTimeStamp < passwordModifiedTimeStamp;
  }
  return false
}

module.exports = mongoose.model('Users', UserSchema);