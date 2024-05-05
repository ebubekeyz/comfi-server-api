const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  deleteAllProducts,
  getAllProducts,
} = require('../controllers/productController');

router
  .route('/')
  .get(getAllProducts)
  .post(auth, createProduct)
  .delete(auth, authPermission('admin', 'owner'), deleteAllProducts);
router
  .route('/:id')
  .get(getSingleProduct)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleProduct)
  .patch(auth, updateSingleProduct);

module.exports = router;
