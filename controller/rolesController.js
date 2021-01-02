const mongoose = require('mongoose');
const Roles = require('../models/rolesModel');

exports.getRoles = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.params)
    if(id) {
      const role = await Roles.find({ _id: id, status: true}).exec();
      if(role) {
        return res.status(200).json({
          status: true,
          data: role
        });
      } else {
        throw 'Invalid user role';
      }
    } else {
      const AllRoles = await Roles.find({ status: true }).exec();
      return res.status(200).json({
        status: true,
        data: AllRoles
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

exports.addRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    console.log(role)
    const roleExists = await Roles.find({ role, status: true }).exec();
    if(roleExists.length >= 1) {
      throw `Role with name ${role} already exists`;
    } else {
      const newRole = await Roles.create(req.body);
      return res.status(200).json({
        status: true,
        data: newRole
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

exports.updateRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const role = await Roles.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true,
        data: role
      });
    } else {
      throw 'Invalid Role'
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.deleteRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const role = await Roles.findByIdAndUpdate(id, { status: false }, {
        new: true,
      })
      return res.status(200).json({
        status: true
      });
    } else {
      throw 'Invalid Role'
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}