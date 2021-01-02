const express = require('express');
const Role = require('../controller/rolesController');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth.middleware'); 

router
  .route('/:id?')
  .get(auth.authenticateRoute, auth.restrictRoute(['admin']), Role.getRoles)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), Role.addRole)
  .patch(auth.authenticateRoute, auth.restrictRoute(['admin']), Role.updateRole)
  .delete(auth.authenticateRoute, auth.restrictRoute(['admin']), Role.deleteRole)

module.exports = router;