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
  datail: {
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
    default: '',
    required: 'Please fill Shop tel'
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
    type: String,
    default: 'active'
  },
  importform: {
    type: String,
    default: 'manual'
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
