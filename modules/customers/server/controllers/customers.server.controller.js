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
  Hotprice = mongoose.model('Hotprice'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



exports.getlat = function (req, res, next, lat, lng) {
  next();
};
exports.getlng = function (req, res, next, lat, lng) {
  next();
};

exports.getcateid = function (req, res, next, cateid) {
  req.cateid = cateid;
  next();
};

exports.getcondition = function(req, res, next, condition){
  req.condition = condition;
  next();
};


exports.getshopbycate = function (req, res) {
  Shop.find({categories: mongoose.Types.ObjectId(req.cateid)}).sort().exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shops);
    }
  });
  
};

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
    title: "Hot Price",
    items1: [],
    items2: []
  };
  next();
};

exports.hotpricesItm1 = function (req, res, next) {
  Hotprice.find({}, '_id image', { skip: 0, limit: 6 }).sort('-created').exec(function (err, hotprices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      hotprices.forEach(function (hotprice) {
        req.hotprices.items1.push(hotprice);
      });
      next();
    }
  });
};

exports.hotpricesItm2 = function (req, res, next) {
  Hotprice.find({}, '_id image', { skip: 6, limit: 6 }).sort('-created').exec(function (err, hotprices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      hotprices.forEach(function (hotprice) {
        req.hotprices.items2.push(hotprice);
      });
      next();
    }
  });
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
        var resCate = {
          _id: category._id,
          image: category.image
        };
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
  var items = [];
  var limit = { limit: 4 };
  if(req.condition){
    limit = { limit: 100 };
  }
  Shop.find({ isactiveshop: true }, '_id name rating coverimage isAds', limit).sort('-created').exec(function (err, shops) {
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
          image: shop.coverimage,
          isAds: shop.isAds
        };
        items.push(resShop);
      });
      if(req.condition && req.condition === 'NEAR_BY'){
        res.json(items);
      }else{
        req.listShop[0].items = items;
        next();
      }
     
    }
  });
};

exports.popshops = function (req, res, next) {
  var items = [];
  var limit = { limit: 4 };
  if(req.condition){
    limit = { limit: 100 };
  }
  Shop.find({ isactiveshop: true }, '_id name rating coverimage isAds', limit).sort('-created').exec(function (err, shops) {
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
          image: shop.coverimage,
          isAds: shop.isAds
        };
        items.push(resShop);
      });
      if(req.condition && req.condition === 'POPULAR'){
        res.json(items);
      }else{
        req.listShop[1].items = items;
        next();
      }
    }
  });
};

exports.favoriteshops = function (req, res, next) {
  var items = [];
  var limit = { limit: 4 };
  if(req.condition){
    limit = { limit: 100 };
  }
  Shop.find({ isactiveshop: true }, '_id name rating coverimage isAds', limit).sort('-created').exec(function (err, shops) {
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
          image: shop.coverimage,
          isAds: shop.isAds
        };
        items.push(resShop);
      });
      if(req.condition && req.condition === 'FAVORITE'){
        res.json(items);
      }else{
        req.listShop[2].items = items;
        next();
      }
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