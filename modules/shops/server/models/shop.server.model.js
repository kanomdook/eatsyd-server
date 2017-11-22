'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shop name',
    unique: true,
    trim: true
  },
  detail: {
    type: String,
    default: ''
  },
  address: {
    address: String,
    subdistinct: String,
    distinct: String,
    province: String,
    postcode: String,
    lat: String,
    lng: String
  },
  tel: {
    type: String,
    default: ''
  },
  profileimage: {
    type: String,
    default: ''
  },
  coverimage: {
    type: String,
    default: ''
  },
  isactiveshop: {
    type: Boolean,
    default: false
  },
  importform: {
    type: String,
    default: 'manual'
  },
  products: {
    type: [{
      name: {
        type: String,
        default: '',
        // required: 'Please fill Product name',
        trim: true
      },
      detail: {
        type: String,
        default: ''
      },
      category: {
        type: String,
        default: ''
      },
      price: {
        type: Number,
        // required: 'Please fill Product price'
      },
      stock: {
        type: Number,
      },
      priority: {
        type: Number
      },
      images: {
        type: [String],
        // required: 'Please fill Product image'
      },
      created: {
        type: Date,
        default: Date.now
      },
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      }
    }]
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

mongoose.model('Shop', ShopSchema);
