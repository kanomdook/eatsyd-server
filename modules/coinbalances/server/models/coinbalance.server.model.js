'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Coinbalance Schema
 */
var CoinbalanceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Coinbalance name',
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

mongoose.model('Coinbalance', CoinbalanceSchema);
