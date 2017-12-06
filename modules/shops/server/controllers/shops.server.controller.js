'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shop = mongoose.model('Shop'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



exports.mailer = function (req, res) {
  // console.log('mail' + req.shop);
  var data = req.shop.user;
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "mynameissarawut@gmail.com",
      pass: "097154642"
    }
  });

  var mailOptions = {
    from: "EatsyD ✔ <mynameissarawut@gmail.com>", // sender address✔
    to: data.email, // list of receivers
    subject: "Username & password for shop", // Subject line
    html: "<p><b>" + "username" + " : " + data.username + "</b></p>" + "   " + "<p><b>" + "password" + " : " + "user1234" + "</b></p>", // plaintext body

  };
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
      res.jsonp(req.shop);
    }

  });
};
/**
 * Create a Shop
 */

exports.cookingBeforeCreate = function (req, res, next) {
  req.shop = {
    name: req.body.name,
    address: {
      address: req.body.vicinity,
      lat: req.body.lat,
      lng: req.body.lng
    },
    tel: req.body.phone,
    coverimage: req.body.img,
    importform: req.body.importForm
  };
  next();
};


exports.create = function (req, res) {
  var shop = new Shop(req.body);
  shop.user = req.user;

  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log('shop' + shop);
      res.jsonp(shop);
    }
  });
};

/**
 * Show the current Shop
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var shop = req.shop ? req.shop.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  shop.isCurrentUserOwner = req.user && shop.user && shop.user._id.toString() === req.user._id.toString();

  res.jsonp(shop);
};

/**
 * Update a Shop
 */
exports.update = function (req, res) {
  var shop = req.shop;

  shop = _.extend(shop, req.body);

  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shop);
    }
  });
};

/**
 * Delete an Shop
 */
exports.delete = function (req, res) {
  var shop = req.shop;

  shop.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shop);
    }
  });
};

/**
 * List of Shops
 */

exports.cookingListShop = function (req, res, next) {
  Shop.find().exec(function (err, result) {
    if (err) {
      return next(err);
    } else if (!result) {
      return res.status(404).send({
        message: 'No Shop with that identifier has been found'
      });
    }
    req.shops = result;
    next();
  });
};

exports.list = function (req, res) {
  // console.log('get list' + req.shops);
  Shop.find().populate('user', 'displayName').exec(function (err, shop) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shops = shop;
      res.jsonp(req.shops);
    }
  });
};

/**
 * Shop middleware
 */
exports.shopByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shop is invalid'
    });
  }

  Shop.findById(id).populate('user').exec(function (err, shop) {
    if (err) {
      return next(err);
    } else if (!shop) {
      return res.status(404).send({
        message: 'No Shop with that identifier has been found'
      });
    }
    req.shop = shop;
    next();
  });
};


exports.createUserByShop = function (req, res, next) {
  var shop = req.shop;
  if (req.user && req.user.roles[0] === 'admin') {
    var firstname = shop.name ? shop.name : shop.name;
    var lastname = shop.name ? shop.name : shop.name;
    var newUser = new User({
      firstName: firstname,
      lastName: lastname,
      displayName: firstname + ' ' + lastname,
      email: shop.email,
      mobile: shop.tel,
      username: shop.email,
      password: 'user1234',
      provider: 'local',
      roles: ['shop']
    });
    newUser.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.usernew = newUser;
        next();
      }
    });
  } else {
    next();
  }
};

exports.updateUserShop = function (req, res, next) {
  // console.log('user new!!' + req.usernew);
  var shop = req.shop;

  // shop = _.extend(shop, req.body);
  Shop.findByIdAndUpdate(shop._id, {
    $set: {
      user: req.usernew._id,
      isactiveshop: true
    }
  }, {
    new: true
  }).populate('user').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shop = shops;
      // console.log('update shop isactive = true', req.shop);
      // res.jsonp(req.shop);
      next();
    }
  });
};
