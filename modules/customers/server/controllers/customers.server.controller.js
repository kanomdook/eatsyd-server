'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ad = mongoose.model('Ad'),
  Categoryshop = mongoose.model('Categoryshop'),
  Shop = mongoose.model('Shop'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



exports.ads = function (req, res, next) {
  req.ads = {
    "title": "Advertise",
    "items": []
  };
  Ad.find().sort('-created').limit(5).exec(function (err, ads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ads.forEach(function (ad) {
        req.ads.items.push(ad);
      });
      next();
    }
  });

};

exports.hotprices = function (req, res, next) {
  req.hotprices = {
    "title": "Hot Price",
    "items1": [{
      "_id": "ht0001",
      "image": "./assets/imgs/hot_price/hotprice1.png"
    }, {
      "_id": "ht0002",
      "image": "./assets/imgs/hot_price/hotprice2.png"
    }, {
      "_id": "ht0003",
      "image": "./assets/imgs/hot_price/hotprice3.png"
    }, {
      "_id": "ht0004",
      "image": "./assets/imgs/hot_price/hotprice4.png"
    }, {
      "_id": "ht0005",
      "image": "./assets/imgs/hot_price/hotprice5.png"
    }, {
      "_id": "ht0006",
      "image": "./assets/imgs/hot_price/hotprice6.png"
    }],
    "items2": [{
      "_id": "ht0007",
      "image": "./assets/imgs/hot_price/hotprice7.png"
    }, {
      "_id": "ht0008",
      "image": "./assets/imgs/hot_price/hotprice8.png"
    }, {
      "_id": "ht0009",
      "image": "./assets/imgs/hot_price/hotprice9.png"
    }, {
      "_id": "ht0010",
      "image": "./assets/imgs/hot_price/hotprice10.png"
    }, {
      "_id": "ht0011",
      "image": "./assets/imgs/hot_price/hotprice11.png"
    }, {
      "_id": "ht0012",
      "image": "./assets/imgs/hot_price/hotprice12.png"
    }]
  };
  next();
};

exports.categories = function (req, res, next) {
  req.categories = {
    "title": "Category",
    "items": []
  };
  Categoryshop.find({}, '_id image').sort('-created').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      categories.forEach(function (category) {
        req.categories.items.push(category);
      });
      next();
    }
  });
};

exports.listShop = function (req, res, next) {
  req.listShop = [{
    "title": "NEAR_BY",
    "items": []
  },
  {
    "title": "POPULAR",
    "items": []
  },
  {
    "title": "FAVORITE",
    "items": []
  }
  ];
  next();
};

exports.nearbyshops = function (req, res, next) {
  Shop.find({ isactiveshop: true }, '_id name rating coverimage').sort('-created').limit(4).exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      shops.forEach(function (shop) {
        var resShop = {
          _id: shop._id,
          name: shop.name,
          rating: shop.rating,
          distance: 1.5,
          image: Shop.coverimage
        };
        req.listShop[0].items.push(resShop);
      });
      next();
    }
  });
};

exports.popshops = function (req, res, next) {
  Shop.find({ isactiveshop: true }, '_id name rating coverimage').sort('-created').limit(4).exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      shops.forEach(function (shop) {
        var resShop = {
          _id: shop._id,
          name: shop.name,
          rating: shop.rating,
          distance: 1.5,
          image: Shop.coverimage
        };
        req.listShop[1].items.push(resShop);
      });
      next();
    }
  });
};

exports.favoriteshops = function (req, res, next) {
  Shop.find({ isactiveshop: true }, '_id name rating coverimage').sort('-created').limit(4).exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      shops.forEach(function (shop) {
        var resShop = {
          _id: shop._id,
          name: shop.name,
          rating: shop.rating,
          distance: 1.5,
          image: Shop.coverimage
        };
        req.listShop[2].items.push(resShop);
      });
      next();
    }
  });
};

exports.returnShop = function (req, res) {
  res.jsonp({
    ads: req.ads,
    hotprices: req.hotprices,
    categories: req.categories,
    shops: req.listShop
  });
};