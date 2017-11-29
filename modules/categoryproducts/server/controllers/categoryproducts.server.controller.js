'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categoryproduct = mongoose.model('Categoryproduct'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Categoryproduct
 */
exports.create = function (req, res) {
  var categoryproduct = new Categoryproduct(req.body);
  categoryproduct.user = req.user;

  categoryproduct.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryproduct);
    }
  });
};

/**
 * Show the current Categoryproduct
 */
exports.read = function (req, res) {
  Categoryproduct.find({
    shop: req.categoryproduct
  }).sort('-created').populate('user', 'displayName').exec(function (err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(result);
      res.jsonp(result);
    }
  });
  // convert mongoose document to JSON
  // var categoryproduct = req.categoryproduct ? req.categoryproduct.toJSON() : {};

  // // Add a custom field to the Article, for determining if the current User is the "owner".
  // // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // categoryproduct.isCurrentUserOwner = req.user && categoryproduct.user && categoryproduct.user._id.toString() === req.user._id.toString();

  // res.jsonp(categoryproduct);
};

/**
 * Update a Categoryproduct
 */
exports.update = function (req, res) {
  var categoryproduct = req.categoryproduct;

  categoryproduct = _.extend(categoryproduct, req.body);

  categoryproduct.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryproduct);
    }
  });
};

/**
 * Delete an Categoryproduct
 */
exports.delete = function (req, res) {
  var categoryproduct = req.categoryproduct;

  categoryproduct.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryproduct);
    }
  });
};

/**
 * List of Categoryproducts
 */
exports.list = function (req, res) {
  Categoryproduct.find().sort('-created').populate('user', 'displayName').exec(function (err, categoryproducts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryproducts);
    }
  });
};

/**
 * Categoryproduct middleware
 */
exports.categoryproductByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categoryproduct is invalid'
    });
  }

  Categoryproduct.findById(id).populate('user', 'displayName').exec(function (err, categoryproduct) {
    if (err) {
      return next(err);
    } else if (!categoryproduct) {
      return res.status(404).send({
        message: 'No Categoryproduct with that identifier has been found'
      });
    }
    req.categoryproduct = categoryproduct;
    next();
  });
};
