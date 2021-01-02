const Users = require('../models/userModel');
const Roles = require('../models/rolesModel');

module.exports = async (req, res, next) => {
    try {
      const roleCount = await Roles.countDocuments({});
      if(roleCount <= 0) {
        const InitialRole = {
          role: 'admin'
        }
        const newRole = await Roles.create(InitialRole);
        await Roles.create({ role: 'trainee'});
        await Users.create({
          name: 'Administrator',
          email: 'admin@training.com',
          username: 'admin@training.com',
          password: 'admin12345',
          password_confirm: 'admin12345',
          role: newRole._id,
        });
      }
      
      next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        status: false,
        message: error.toString()
      });
    }
};