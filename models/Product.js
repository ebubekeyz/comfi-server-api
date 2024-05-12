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
    color1: {
      type: String,
    },
    color2: {
      type: String,
    },
    color3: {
      type: String,
    },
    color4: {
      type: String,
    },
    colors: [],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);
ProductSchema.pre('save', function () {
  this.colors.unshift(this.color1, this.color2, this.color3, this.color4);
});
module.exports = mongoose.model('Product', ProductSchema);
