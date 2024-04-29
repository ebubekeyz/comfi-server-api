const mongoose = require('mongoose');
const moment = require('moment');

const SingleOrderItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please provide an image'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
  },
  title: {
    type: String,
    required: [true, 'Please provide an title'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  cartID: {
    type: String,
    required: [true, 'Please provide cartID'],
  },
  company: {
    type: String,
    required: [true, 'Please provide an company'],
  },

  productColor: {
    type: String,
    required: [true, 'Please provide an productColor'],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, 'Please provide address'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    orderTotal: {
      type: String,
      required: [true, 'Please provide total order'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    numItemsInCart: {
      type: Number,
      required: [true, 'Please provide number of items in cart'],
    },
    cartItems: [SingleOrderItemSchema],
    date: {
      type: String,
      default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
