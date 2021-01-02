const Users = require('../models/userModel');

const restrictRoute = (req, res, next) => {
  try {
    if(req.userData.role.role !== 'admin') {
      console.log(req.params.id, req.userData._id)
      if(req.params.id != req.userData._id) {
        throw 'Permission denied from User Restrict Route'
      }
    }
    next()
  } catch (error) {
    console.log(error)
    return res.status(403).json({
      status: false,
      message: error.toString()
    });
  }
};

module.exports = {
  restrictRoute
}