const express = require('express');
const Auth = require('../controller/authController');
const router = express.Router();


router
  .route('/')
  .post(Auth.login)


module.exports = router;