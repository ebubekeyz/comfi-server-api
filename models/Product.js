const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    company: {
      type: String,
      default: 'stella york',
    },
    shipping: {
      type: String,
      default: 'off',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: ['Wedding Dress', 'Bridal Wedding Dress'],
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image'],
    },
    description: {
      type: String,
    },
    colors: ['black', 'white'],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
