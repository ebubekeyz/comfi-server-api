const mongoose = require('mongoose');
const moment = require('moment');

const SingleOrderItemSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  cartID: { type: String, required: true },
  company: { type: String, required: true },
  productColor: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    orderTotal: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    numItemsInCart: {
      type: Number,
      required: true,
    },
    cartItems: [SingleOrderItemSchema],
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
