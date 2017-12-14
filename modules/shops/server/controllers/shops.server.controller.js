'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shop = mongoose.model('Shop'),
  User = mongoose.model('User'),
  Categoryproduct = mongoose.model('Categoryproduct'),
  Product = mongoose.model('Product'),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



exports.mailer = function (req, res) {
  // console.log('mail' + req.shop);
  // var data = req.shop.user;
  // var smtpTransport = nodemailer.createTransport("SMTP", {
  //   service: "Gmail",
  //   auth: {
  //     user: "mynameissarawut@gmail.com",
  //     pass: "097154642"
  //   }
  // });

  // var mailOptions = {
  //   from: "EatsyD ✔ <mynameissarawut@gmail.com>", // sender address✔
  //   // to: data.email, // list of receivers
  //   to: 'mynameissarawut@gmail.com',
  //   subject: "Username & password for shop", // Subject line
  //   html: "<p><b>" + "username" + " : " + data.username + "</b></p>" + "   " + "<p><b>" + "password" + " : " + "user1234" + "</b></p>", // plaintext body

  // };
  // smtpTransport.sendMail(mailOptions, function (error, response) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Message sent: " + response.message);
  //     res.jsonp(req.shop);
  //   }

  // });
  res.jsonp(req.shop);
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


exports.list = function (req, res) {

  Shop.find().sort('name').populate('user', 'firstName').exec(function (err, shop) {
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

  Shop.findById(id).populate('user').populate('categories').populate({
    path: 'items', populate: [
      { path: 'cate', model: 'Categoryproduct' },
      { path: 'products', model: 'Product' }
    ]
  }).exec(function (err, shop) {
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
    User.find({
      username: newUser.username
    }).exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (users && users.length > 0) {
          req.usernew = users[0];
          next();
        } else {
          newUser.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: 'genUser ' + errorHandler.getErrorMessage(err)
              });
            } else {
              req.usernew = newUser;
              next();
            }
          });
        }
        // res.jsonp(req.shops);
      }
    });

  } else {
    next();
  }
};

exports.updateUserShop = function (req, res, next) {
  var shop = req.shop;
  Shop.findById(shop._id).populate('user').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: 'Update Shop ' + errorHandler.getErrorMessage(err)
      });
    } else {
      shops.user = req.usernew;
      shops.issendmail = true;

      shops.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          User.populate(shops, {
            path: "user"
          }, function (err, shopsRes) {
            req.shop = shopsRes;
            next();
          });
        }
      });
    }
  });
};


///////////////// filter /////////////////////
exports.getShop = function (req, res, next) {
  req.shopRes = [{
    name: 'รายการร้านค้า',
    items: []
  }, {
    name: 'ร้านค้าใหม่',
    items: []
  }, {
    name: 'official',
    items: []
  }, {
    name: 'ร้านฝากซื้อ',
    items: []
  }];
  next();
};

exports.cookingAll = function (req, res, next) {
  Shop.find({}, '_id name name_eng detail address tel email facebook line promoteimage coverimage isactiveshop issendmail importform times categories user').sort('name').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shopRes[0].items = shops;
      next();
    }
  });
};

exports.cookingNew = function (req, res, next) {
  Shop.find({}, '_id name name_eng detail address tel email facebook line promoteimage coverimage isactiveshop issendmail importform times categories user').sort('-created').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shopRes[1].items = shops;
      next();
    }
  });
};

exports.cookingOfficial = function (req, res, next) {
  Shop.find({}, '_id name name_eng detail address tel email facebook line promoteimage coverimage isactiveshop issendmail importform times categories user').sort('name').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (shops && shops.length > 0) {
        shops.forEach(function (shop) {
          if (shop.issendmail === true) {
            req.shopRes[2].items.push(shop);
          }
        });
        next();
      } else {
        next();
      }
    }
  });
};

exports.cookingConsignment = function (req, res, next) {
  Shop.find({}, '_id name name_eng detail address tel email facebook line promoteimage coverimage isactiveshop issendmail importform times categories user').sort('name').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (shops && shops.length > 0) {
        shops.forEach(function (shop) {
          if (shop.issendmail === false && shop.isactiveshop === true) {
            req.shopRes[3].items.push(shop);
          }
        });
        next();
      } else {
        next();
      }
    }
  });
};

exports.listFilter = function (req, res) {
  res.jsonp({
    filtercate: req.shopRes
  });
};


exports.cookingHomeShop = function (req, res, next) {
  // console.log(req.user._id);
  Shop.find({
    user: req.user._id
  }).sort('-created').populate('categories').populate({
    path: 'items', populate: [
      { path: 'cate', model: 'Categoryproduct' },
      { path: 'products', model: 'Product' }
    ]
  }).exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (shops && shops.length > 0) {
        req.shop = shops[0];
        next();
      } else {
        res.jsonp([]);
      }
    }
  });
};

exports.resHomeShop = function (req, res) {
  var shop = req.shop ? req.shop.toJSON() : {};
  var items = [];
  shop.items.forEach(function (itm) {
    var cookingItem = {
      cate: {
        _id: itm.cate._id,
        name: itm.cate.name,
        image: itm.cate.image
      },
      products: []
    };
    itm.products.forEach(function (i) {
      cookingItem.products.push({
        _id: i._id,
        name: i.name,
        image: i.images && i.images.length > 0 ? i.images[0] : 'noimage',
        price: i.price
      });
    });
    items.push(cookingItem);
  });
  var resShop = {
    _id: shop._id,
    name: shop.name,
    detail: shop.detail,
    address: shop.address,
    tel: shop.tel,
    email: shop.email,
    facebook: shop.facebook || '',
    line: shop.line || '',
    promoteimage: shop.promoteimage,
    items: items,
    coverimage: shop.coverimage,
    isactiveshop: shop.isactiveshop,
    issendmail: shop.issendmail,
    importform: shop.importform,
    times: shop.times
  };
  res.jsonp(resShop);
};


exports.cookingAdminHome = function (req, res, next) {
  var listname = ['รายการร้านค้า', 'ร้านค้าใหม่', 'official', 'ร้านฝากซื้อ'];

  req.listhome = listname;
  next();
};

exports.countPaging = function (req, res, next) {
  var numpage = [];
  Shop.find().sort('name').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (shops && shops.length > 0) {
        var pages = shops.length / 10;
        var pagings = Math.ceil(pages);
        req.items = shops.slice(0, 10);
        for (var i = 0; i < pagings; i++) {
          numpage.push(i + 1);
        }

      }
      req.paging = numpage;
      next();
    }
  });
};

exports.listHome = function (req, res) {
  res.jsonp({
    name: req.listhome,
    pagings: req.paging,
    items: req.items
  });
};

exports.sortName = function (req, res, next) {
  var firstIndex = 0;
  var lastIndex = 10;
  if (req.body.currentpage > 1) {
    firstIndex = ((req.body.currentpage - 1) * 10);
    lastIndex = (req.body.currentpage * 10);
  }
  if (req.body.typename === 'รายการร้านค้า') {
    var numpage = [];
    var keywords = {};
    if (req.body.keyword) {
      keywords = searchKeyword(req.body.keyword);
    }
    Shop.find(keywords).sort('name').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.pagings = countPage(shops);
        req.items = shops.slice(firstIndex, lastIndex);
        next();
      }
    });
  } else {
    next();
  }

};

exports.sortDate = function (req, res, next) {
  var firstIndex = 0;
  var lastIndex = 10;
  if (req.body.currentpage > 1) {
    firstIndex = ((req.body.currentpage - 1) * 10);
    lastIndex = (req.body.currentpage * 10);
  }
  if (req.body.typename === 'ร้านค้าใหม่') {
    var numpage = [];
    var keywords = {};
    if (req.body.keyword) {
      keywords = searchKeyword(req.body.keyword);
    }
    Shop.find(keywords).sort('-created').populate('categories').populate('user', 'firstName').exec(function (err, shops) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.pagings = countPage(shops);
        req.items = shops.slice(firstIndex, lastIndex);
        next();
      }
    });
  } else {
    next();
  }

};

exports.sortOfficial = function (req, res, next) {
  var firstIndex = 0;
  var lastIndex = 10;
  if (req.body.currentpage > 1) {
    firstIndex = ((req.body.currentpage - 1) * 10);
    lastIndex = (req.body.currentpage * 10);
  }
  if (req.body.typename === 'official') {
    var numpage = [];
    var keywords = {};
    if (req.body.keyword) {
      keywords = searchKeyword(req.body.keyword);
    }
    Shop.find(keywords).sort('name').where('issendmail').equals(true).populate('categories').populate('user', 'firstName').exec(function (err, shops) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.pagings = countPage(shops);
        req.items = shops.slice(firstIndex, lastIndex);
        next();
      }
    });
  } else {
    next();
  }

};

exports.sortUnofficial = function (req, res, next) {
  var firstIndex = 0;
  var lastIndex = 10;
  if (req.body.currentpage > 1) {
    firstIndex = ((req.body.currentpage - 1) * 10);
    lastIndex = (req.body.currentpage * 10);
  }
  if (req.body.typename === 'ร้านฝากซื้อ') {
    var numpage = [];
    var keywords = {};
    if (req.body.keyword) {
      keywords = searchKeyword(req.body.keyword);
    }
    Shop.find(keywords).sort('name').where('issendmail').equals(false).populate('categories').populate('user', 'firstName').exec(function (err, shops) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.pagings = countPage(shops);
        req.items = shops.slice(firstIndex, lastIndex);
        next();
      }
    });
  } else {
    next();
  }

};

exports.filterPage = function (req, res) {
  var data = req.body;
  res.jsonp({
    items: req.items,
    pagings: req.pagings
  });
};

exports.changeCover = function (req, res, next) {
  var shop = req.shop;
  shop.coverimage = req.body.data;
  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shop = shop;
      next();
    }
  });
};

exports.resShopData = function (req, res) {
  var shop = req.shop ? req.shop.toJSON() : {};
  var items = [];
  shop.items.forEach(function (itm) {
    var cookingItem = {
      cate: {
        _id: itm.cate._id,
        name: itm.cate.name,
        image: itm.cate.image
      },
      products: []
    };
    itm.products.forEach(function (i) {
      cookingItem.products.push({
        _id: i._id,
        name: i.name,
        image: i.images && i.images.length > 0 ? i.images[0] : 'noimage',
        price: i.price
      });
    });
    items.push(cookingItem);
  });
  var resShop = {
    _id: shop._id,
    name: shop.name,
    detail: shop.detail,
    address: shop.address,
    tel: shop.tel,
    email: shop.email,
    facebook: shop.facebook || '',
    line: shop.line || '',
    promoteimage: shop.promoteimage,
    items: items,
    coverimage: shop.coverimage,
    isactiveshop: shop.isactiveshop,
    issendmail: shop.issendmail,
    importform: shop.importform,
    times: shop.times
  };
  res.jsonp(resShop);
};

exports.addPromote = function (req, res, next) {
  var shop = req.shop;
  shop.promoteimage.push(req.body.data);
  if (shop.promoteimage.length > 10) {
    return res.status(400).send({
      message: 'Promote images is limited.'
    });
  }
  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shop = shop;
      next();
    }
  });
};

exports.createCate = function (req, res, next) {
  var cate = new Categoryproduct(req.body);
  cate.shop = req.shop;
  cate.user = req.user;
  cate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.cate = cate;
      next();
    }
  });
};

exports.addCateToShop = function (req, res, next) {
  var shop = req.shop;
  shop.items.push({
    cate: req.cate,
    products: []
  });
  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {


      Shop.findById(shop._id).populate('user').populate('categories').populate({
        path: 'items', populate: [
          { path: 'cate', model: 'Categoryproduct' },
          { path: 'products', model: 'Product' }
        ]
      }).exec(function (err, shop) {
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
    }
  });
};

exports.createProduct = function (req, res, next) {
  var product = new Product(req.body);
  product.shop = req.shop;
  product.user = req.user;
  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.product = product;
      next();
    }
  });
};

exports.addProductToShop = function (req, res, next) {
  var shop = req.shop;
  shop.items.forEach(function (itm) {
    if (req.product.categories.toString() === itm.cate._id.toString()) {
      itm.products.push(req.product);
    }
  });
  shop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {


      Shop.findById(shop._id).populate('user').populate('categories').populate({
        path: 'items', populate: [
          { path: 'cate', model: 'Categoryproduct' },
          { path: 'products', model: 'Product' }
        ]
      }).exec(function (err, shop) {
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
    }
  });
};

//count page
function countPage(shops) {
  var numpage = [];
  if (shops && shops.length > 0) {
    var pages = shops.length / 10;
    var pagings = Math.ceil(pages);
    for (var i = 0; i < pagings; i++) {
      numpage.push(i + 1);
    }

  }
  return numpage;
}

//search keyword
function searchKeyword(keyWord) {
  var keyword = {
    $or: [{
      'name': {
        '$regex': keyWord,
        '$options': 'i'
      }
    },
    {
      'detail': {
        '$regex': keyWord,
        '$options': 'i'
      }
    },
    {
      'tel': {
        '$regex': keyWord,
        '$options': 'i'
      }
    }
    ]
  };
  return keyword;
}
