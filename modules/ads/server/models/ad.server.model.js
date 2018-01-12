'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ad Schema
 * "image": "./assets/imgs/ads/ads1.png",
      "isvideo": true,
      "videoid": "###"
 */
var AdSchema = new Schema({
  image: {
    type: String,
    default: '',
    required: 'Please fill Ad image',
    trim: true
  },
  isvideo:{
    type: Boolean,
    default: false
  },
  videoid:{
    type: String,
    default: ''
  },
  effectivedatestart:{
    type: Date
  },
  effectivedateend:{
    type: Date
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
