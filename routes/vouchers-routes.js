const express = require('express');
const Vouchers = require('../controller/voucherController');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth.middleware'); // to protect routes with authentication

router
  .route('/assigned')
  .get(auth.authenticateRoute, auth.restrictRoute(['admin']), Vouchers.getAssignedVouchers)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), Vouchers.assignVouchers)
router
  .route('/:vid?')
  .get(auth.authenticateRoute, auth.restrictRoute(['admin']), Vouchers.getVouchers)
  .post(auth.authenticateRoute, auth.restrictRoute(['admin']), Vouchers.addVouchers)
  .patch(auth.authenticateRoute, auth.restrictRoute(['admin']), Vouchers.updateVouchers)

module.exports = router;