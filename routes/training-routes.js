const express = require('express');
const providerRouter = require('./trainingProviders-routes'); // import provider routes
const voucherRouter = require('./vouchers-routes'); // import voucher routes
const Training = require('../controller/trainingController'); // import training controller
const router = express.Router();
const auth = require('../middlewares/auth.middleware'); // to protect routes with authentication

router.use('/provider', providerRouter); //using provider route as child of training route
router.use('/:tid?/vouchers', voucherRouter); //using voucher route as child of training route
router
  .route('/:id?')
  .get(auth.authenticateRoute, auth.restrictRoute(['admin', 'trainee']), Training.getTrainings)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), Training.addTraining)
  .patch(auth.authenticateRoute, auth.restrictRoute(['admin']), Training.updateTraining)
  .delete(auth.authenticateRoute, auth.restrictRoute(['admin']), Training.deleteTraining)


module.exports = router;