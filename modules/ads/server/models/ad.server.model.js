'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ad Schema
 */
var AdSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Ad name',
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

mongoose.model('Ad', AdSchema);
