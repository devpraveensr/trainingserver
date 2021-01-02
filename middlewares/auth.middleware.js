const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Users = require('../models/userModel');

const authenticateRoute = async (req, res, next) => {
  try {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(" ")[1];
      if(!token) {
        throw 'You are not logged in. Please login to get access.';
      }
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const user = await Users.findById(decoded.id);
      if(!user) {
        throw 'This user no longer exists';
      }
      if(user.passChangeAfterToken(decoded.iat)) {
        throw 'Password has been changed please login again.';
      }
      req.userData = user;
      
      next();
    } else {
      throw 'You are not logged in. Please login to get access.';
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      status: false,
      message: error.toString()
    });
  }
};

const restrictRoute = (roles) => {
  return (req, res, next) => {
    
    try {
      if(!roles.includes(req.userData.role.role)) throw 'Permission denied for this user';
      next()
    } catch (error) {
      console.log(error)
      return res.status(403).json({
        status: false,
        message: error.toString()
      });
    }
  };
}

module.exports = {
  authenticateRoute,
  restrictRoute
}