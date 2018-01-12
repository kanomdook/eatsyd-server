'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Benefitsetting Schema
 */
var BenefitsettingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Benefitsetting name',
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

mongoose.model('Benefitsetting', BenefitsettingSchema);
