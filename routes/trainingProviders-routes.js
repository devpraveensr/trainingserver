const express = require('express');
const trainingProviders = require('../controller/trainingProvidersController');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth.middleware'); // to protect routes with authentication

router
  .route('/:id?')
  .get(auth.authenticateRoute, auth.restrictRoute(['admin']), trainingProviders.getProviders)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), trainingProviders.addProvider)
  .patch(auth.authenticateRoute, auth.restrictRoute(['admin']), trainingProviders.updateProvider)
  .delete(auth.authenticateRoute, auth.restrictRoute(['admin']), trainingProviders.deleteProvider)

module.exports = router;