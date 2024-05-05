const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createOrder,
  getSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
  deleteAllOrders,
  getAllOrders,
  getAllOrders2,
} = require('../controllers/orderController');

router
  .route('/')
  .post(auth, createOrder)
  .get(auth, authPermission('admin', 'owner', 'user'), getAllOrders)
  .delete(auth, authPermission('admin', 'owner'), deleteAllOrders);

router.route('/allOrders').get(getAllOrders2);

router
  .route('/:id')
  .patch(auth, updateSingleOrder)
  .get(auth, authPermission('admin', 'owner', 'user'), getSingleOrder)
  .delete(auth, authPermission('admin', 'owner', 'user'), deleteSingleOrder);

module.exports = router;
