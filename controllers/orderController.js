const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const moment = require('moment');

const createOrder = async (req, res) => {
  const { name, address, numItemsInCart, orderTotal, cartItems } = req.body;

  console.log(name, address);

  const order = await Order.create({
    name,
    address,
    numItemsInCart,
    orderTotal,
    cartItems,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order: order });
};

const getAllOrders = async (req, res) => {
  let { sort, name, search, date, createdAt, price, status } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Order.find(queryObject);

  if (search) {
    result = Order.find(queryObject, {
      name: { $regex: search, $options: 'i' },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (price) {
    result = Order.find(queryObject, { 'cartItems.price': { $eq: price } });
  }
  if (status) {
    result = Order.find(queryObject, { status: { $eq: status } });
  }

  if (date) {
    result = Order.find(queryObject, { date: { $regex: date, $options: 'i' } });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = Number(page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const order = await result;

  const totalOrder = await Order.countDocuments();
  const numOfPage = Math.ceil(totalOrder / limit);

  res.status(StatusCodes.OK).json({
    order: order,
    meta: {
      pagination: { page: page, total: totalOrder, pageCount: numOfPage },
    },
  });
};

const getAllOrders2 = async (req, res) => {
  let { sort, name, search, date, createdAt, price, status } = req.query;

  let result = Order.find({});

  if (search) {
    result = Order.find({
      name: { $regex: search, $options: 'i' },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (price) {
    result = Order.find({ 'cartItems.price': { $eq: price } });
  }
  if (status) {
    result = Order.find({ status: { $eq: status } });
  }

  if (date) {
    result = Order.find({
      date: { $eq: date },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = Number(page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const order = await result;

  const totalOrder = await Order.countDocuments();
  const numOfPage = Math.ceil(totalOrder / limit);

  res.status(StatusCodes.OK).json({
    order: order,
    meta: {
      pagination: { page: page, total: totalOrder, pageCount: numOfPage },
    },
  });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new BadRequestError(`No order with id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order: order });
};

const updateSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOneAndUpdate({ _id: orderId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    throw new BadRequestError(`No order with id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order: order });
};

const deleteSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findByIdAndDelete({ _id: orderId });
  if (!order) {
    throw new BadRequestError(`No order with id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Order Deleted' });
};

const deleteAllOrders = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Orders Deleted' });
};
module.exports = {
  createOrder,
  getSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
  deleteAllOrders,
  getAllOrders,
  getAllOrders2,
};
