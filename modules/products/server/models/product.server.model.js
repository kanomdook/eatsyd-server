'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    unique: true,
    trim: true
  },
  name_eng: {
    type: String,
    default: ''
  },
  detail: {
    type: String,
    default: ''
  },
  categories: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  currency: {
    type: Schema.ObjectId,
    ref: 'Currency'
  },
  prices: {
    type: [{
      name: String,
      price: Number
    }],
    required: 'Please fill prices'
  },
  stock: {
    type: Number
  },
  priority: {
    type: Number
  },
  images: {
    type: [String]
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
