const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Auth = require('./authController');

exports.getUsers = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const users = await Users.find({ _id: id}).exec();
      if(users) {
        return res.status(200).json({
          status: true,
          data: users
        });
      } else {
        throw 'Invalid User';
      }
    } else {
      const AllUsers = await Users.find().exec();
      return res.status(200).json({
        status: true,
        data: AllUsers
      });
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.addUser = async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    delete newUser.password
    return res.status(200).json({
      status: true,
      data: newUser
    });
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const user = await Users.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true,
        data: user
      });
    } else {
      throw 'Invalid Users'
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const user = await Users.findByIdAndUpdate(id, { status: false }, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true
      });
    } else {
      throw 'Invalid user'
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

