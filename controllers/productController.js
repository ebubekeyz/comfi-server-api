const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const moment = require('moment');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: product });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new BadRequestError(`No product with id ${productId} was found`);
  }

  res.status(StatusCodes.OK).json({ attributes: product });
};

const updateSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new BadRequestError(`No product with id ${productId} was found`);
  }

  res.status(StatusCodes.OK).json({ attributes: product });
};

const deleteSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndDelete({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Product deleted' });
};

const deleteAllProducts = async (req, res) => {
  const product = await Product.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Products Deleted' });
};

const getAllProducts = async (req, res) => {
  let { order, search, sort, price, featured, company, shipping, category } =
    req.query;

  let result = Product.find({});

  if (search) {
    result = Product.find({ title: { $regex: search, $options: 'i' } });
  }
  if (company) {
    result = Product.find({ company: { $regex: company, $options: 'i' } });
  }
  if (shipping) {
    result = Product.find({ shipping: { $regex: shipping, $options: 'i' } });
  }

  if (category) {
    result = Product.find({ category: { $regex: category, $options: 'i' } });
  }

  // note

  if (price) {
    result = Product.find({ price: { $lte: price } });
  }
  if (featured) {
    result = Product.find({ featured: { $eq: featured } });
  }

  if (order === 'high') {
    result = Product.find({ price: { $gt: 10000 } });
  }
  if (order === 'low') {
    result = Product.find({ price: { $lt: 10000 } });
  }

  if (order === 'a-z') {
    result = result.sort('title');
  }
  if (order === 'z-a') {
    result = result.sort('-title');
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const product = await result;

  const totalProducts = await Product.countDocuments();
  const numOfPage = Math.ceil(totalProducts / limit);

  res.status(StatusCodes.OK).json({
    attributes: product,
    meta: {
      pagination: { page: page, total: totalProducts, pageCount: numOfPage },
      companies: ['adidas', 'nike'],
      categories: ['wedding dress', 'bridalmaid dress'],
    },
  });
};

module.exports = {
  createProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  deleteAllProducts,
  getAllProducts,
};
