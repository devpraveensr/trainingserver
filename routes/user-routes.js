const express = require('express');
const roleRouter = require('./roles-routes');
const User = require('../controller/userController');
const router = express.Router();
const auth = require('../middlewares/auth.middleware'); 
const user = require('../middlewares/user.middleware'); 

router.use('/role', roleRouter);
router
  .route('/:id?')
  .get(auth.authenticateRoute, user.restrictRoute, User.getUsers)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), User.addUser)
  .patch(auth.authenticateRoute, user.restrictRoute, User.updateUser)
  .delete(auth.authenticateRoute, auth.restrictRoute(['admin']), User.deleteUser)


module.exports = router;