const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const { createOrder } = require('../controllers/productOrderController');

router.route('/').post(auth, createOrder);

module.exports = router;
