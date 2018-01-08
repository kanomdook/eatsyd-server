'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User(s) Management
 */
exports.initlist = function (req, res, next) {
  req.usersofrole = [
    { name: "customer", users: [] },
    { name: "shopowner", users: [] },
    { name: "admin", users: [] },
    { name: "biker", users: [] }
  ];

  next();
};

exports.customer = function(req, res, next){
  User.find({roles: 'user'},'_id displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    users.forEach(function (user) {
      req.usersofrole[0].users.push(user);
    });
    next();
  });
  
};

exports.shopowner = function(req, res, next){
  User.find({roles: 'shop'}, '_id displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    users.forEach(function (user) {
      req.usersofrole[1].users.push(user);
    });
    next();
  });
  
};
exports.admins = function(req, res, next){
  User.find({roles: 'admin'}, '_id displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    users.forEach(function (user) {
      req.usersofrole[2].users.push(user);
    });
    next();
  });
  
};

exports.biker = function(req, res, next){
  User.find({roles: 'shop'}, '_id displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    users.forEach(function (user) {
      req.usersofrole[3].users.push(user);
    });
    next();
  });
  
};

exports.managelist = function (req, res) {
  res.json({
    filterrole: req.usersofrole
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
