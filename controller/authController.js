const { promisify } = require('util');
const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.GenerateToken = id => {
  return token = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}
exports.VerifyToken = async (token, Secret = process.env.JWT_SECRET) => {
  return await promisify(jwt.verify)(token, Secret);
}
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
    const user =  await Users.findOne({ username }).select('+password');
    console.log(user)
    if(!user || !(await user.passCompare(password, user.password))) {
      throw 'Incorrect username or password';
    } else {
      const token = this.GenerateToken(user._id);
      const decodedToken = await this.VerifyToken(token);
      const updatedUser = await Users.findByIdAndUpdate(user._id, {
        last_login: new Date(parseInt(decodedToken.iat * 1000, 10))
      }, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true,
        data: {
          token: token,
          token_type: 'Bearer',
          expires_in: new Date(parseInt(decodedToken.exp * 1000, 10)),
          user: updatedUser
        }
      });
    }
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
  
}