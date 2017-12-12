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
  name_eng: {
    type: String,
    default: ''
  },
  detail: {
    type: String,
    default: ''
  },
  address: {
    addressdetail: String,
    address: String,
    subdistinct: String,
    distinct: String,
    province: String,
    postcode: String,
    lat: String,
    lng: String,
  },
  tel: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: '',
  },
  facebook: {
    type: String,
    default: ''
  },
  line: {
    type: String,
    default: ''
  },
  promoteimage: {
    type: [String],
    default: []
  },
  coverimage: {
    type: String,
    default: ''
  },
  isactiveshop: {
    type: Boolean,
    default: false
  },
  issendmail: {
    type: Boolean,
    default: false
  },
  importform: {
    type: String,
    default: 'manual'
  },
  items: {
    type: [{
      catename: {
        type: String
      },
      image: {
        type: String
      },
      items: {
        type: [{
          name: {
            type: String
          },
          price: {
            type: Number
          },
          image: {
            type: [String]
          }
        }]
      }
    }]
  },
  times: {
    type: [{
      description: String,
      timestart: String,
      timeend: String,
      days: [String]
    }]
  },
  categories: {
    type: Schema.ObjectId,
    ref: 'Categoryshop'
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
