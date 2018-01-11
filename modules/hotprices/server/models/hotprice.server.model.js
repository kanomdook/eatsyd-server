'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hotprice Schema
 */
var HotpriceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Hotprice name',
    trim: true
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

mongoose.model('Hotprice', HotpriceSchema);
