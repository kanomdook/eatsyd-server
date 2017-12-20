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
        _id: i.name === 'default' ? null : i._id,
        name: i.name === 'default' ? '' : i.name,
        image: i.images && i.images.length > 0 ? i.images[0] : './assets/imgs/add.jpg',
        price: i.name === 'default' ? null : i.price
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
    times: shop.times,
    isopen: true
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
  // console.log('ddddddddd' +shop.items);
  // console.log(shop.items);

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
        _id: i.name === 'default' ? null : i._id,
        name: i.name === 'default' ? '' : i.name,
        image: i.images && i.images.length > 0 ? i.images[0] : './assets/imgs/add.jpg',
        price: i.name === 'default' ? null : i.price
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
    times: shop.times,
    isopen: true
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
  var index = 0;
  if (shop.items && shop.items.length > 0) {
    shop.items.forEach(function (itm, i) {
      if (itm.cate === req.cate._id) {
        index = i;
      }
    });
    for (let i = 0; i < 30; i++) {
      shop.items[index].products.push(req.defaultProd);
    }
  }


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
      req.product = product.toJSON();
      next();
    }
  });
};

exports.defaultProduct = function (req, res, next) {
  Product.find({ name: 'default' }).exec(function (err, defaultProd) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (defaultProd && defaultProd.length > 0) {
        req.defaultProd = defaultProd[0];
        next();
      } else {
        var product = new Product({
          name: 'default'
        });
        product.save(function (err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // console.log(product);
            req.defaultProd = product.toJSON();
            next();
          }
        });
      }
    }
  });
};

exports.addProductToShop = function (req, res, next) {
  var shop = req.shop;
  var index = parseInt(req.body.index);
  var cateindex = parseInt(req.body.cateindex);
  var items = shop.items[cateindex].products ? shop.items[cateindex].products : [];
  for (let i = 0; i < 30; i++) {
    if (i === index) {
      items[i] = req.product;
    }
  }
  shop.items[cateindex].products = items;
  shop.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shop = shop;
      next();
    }
  });
};

exports.editShop = function (req, res) {
  var shop = req.shop;
  var _shop = req.body;
  shop.categories = _shop.categories;
  shop.name = _shop.name;
  shop.name_eng = _shop.name_eng;
  shop.detail = _shop.detail;
  shop.tel = _shop.tel;
  shop.email = _shop.email;
  shop.address = _shop.address;
  shop.times = _shop.times;
  shop.coverimage = _shop.coverimage;
  shop.othercontact = _shop.othercontact;
  shop.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shop);
    }
  });
};

exports.ads = function (req, res, next) {
  req.ads = {
    "title": "Advertise",
    "items": [{
      "_id": "ads001",
      "image": "./assets/imgs/ads/ads1.png",
      "isvideo": true,
      "videoid": "###"
    },
    {
      "_id": "ads002",
      "image": "./assets/imgs/ads/ads2.png",
      "isvideo": false,
      "videoid": ""
    },
    {
      "_id": "ads003",
      "image": "./assets/imgs/ads/ads3.png",
      "isvideo": true,
      "videoid": "###"
    },
    {
      "_id": "ads004",
      "image": "./assets/imgs/ads/ads4.png",
      "isvideo": false,
      "videoid": ""
    },
    {
      "_id": "ads005",
      "image": "./assets/imgs/ads/ads5.png",
      "isvideo": false,
      "videoid": ""
    }
    ]
  };
  next();
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
    "items": [{
      "_id": "cat0000",
      "image": "./assets/imgs/Catagory/cat0.png"
    },
    {
      "_id": "cat0001",
      "image": "./assets/imgs/Catagory/cat1.png"
    },
    {
      "_id": "cat0002",
      "image": "./assets/imgs/Catagory/cat2.png"
    },
    {
      "_id": "cat0003",
      "image": "./assets/imgs/Catagory/cat3.png"
    },
    {
      "_id": "cat0004",
      "image": "./assets/imgs/Catagory/cat4.png"
    },
    {
      "_id": "cat0005",
      "image": "./assets/imgs/Catagory/cat5.png"
    },
    {
      "_id": "cat0006",
      "image": "./assets/imgs/Catagory/cat6.png"
    },
    {
      "_id": "cat0007",
      "image": "./assets/imgs/Catagory/cat7.png"
    },
    {
      "_id": "cat0008",
      "image": "./assets/imgs/Catagory/cat8.png"
    },
    {
      "_id": "cat0009",
      "image": "./assets/imgs/Catagory/cat9.png"
    },
    {
      "_id": "cat00010",
      "image": "./assets/imgs/Catagory/cat10.png"
    }
    ]
  };
  next();
};

exports.listShop = function (req, res, next) {
  req.listShop = [{
    "title": "Promotion",
    "items": [{
      "_id": "pro0001",
      "name": "ข้าวหมูแดงอาก๋ง",
      "rating": 5,
      "distance": 5.2,
      "image": "./assets/imgs/shop/shop1.png"
    },
    {
      "_id": "pro0002",
      "name": "Bottle Kitchen",
      "rating": 4,
      "distance": 10.5,
      "image": "./assets/imgs/shop/shop2.png"
    },
    {
      "_id": "pro0003",
      "name": "Steak House",
      "rating": 3,
      "distance": 2.4,
      "image": "./assets/imgs/shop/shop3.png"
    },
    {
      "_id": "pro0004",
      "name": "ครัวคุณโก๋",
      "rating": 5,
      "distance": 15.3,
      "image": "./assets/imgs/shop/shop4.png"
    },
    {
      "_id": "pro0005",
      "name": "Poppen",
      "rating": 4,
      "distance": 4.2,
      "image": "./assets/imgs/shop/shop5.png"
    }
    ]
  },
  {
    "title": "Near by",
    "items": [{
      "_id": "nb0001",
      "name": "Poppen",
      "rating": 4,
      "distance": 0.2,
      "image": "./assets/imgs/shop/shop5.png"
    },
    {
      "_id": "nb0002",
      "name": "ข้าวหมูแดงอาก๋ง",
      "rating": 5,
      "distance": 0.9,
      "image": "./assets/imgs/shop/shop1.png"
    },
    {
      "_id": "nb0003",
      "name": "แซ่บแน่",
      "rating": 4,
      "distance": 2.1,
      "image": "./assets/imgs/shop/shop6.png"
    },
    {
      "_id": "nb0004",
      "name": "Sushi World",
      "rating": 4,
      "distance": 3.9,
      "image": "./assets/imgs/shop/shop7.png"
    }
    ]
  },
  {
    "title": "Popular",
    "items": [{
      "_id": "pop0001",
      "name": "ภัตตาคารหลวง",
      "rating": 5,
      "distance": 5.2,
      "image": "./assets/imgs/shop/shop8.png"
    },
    {
      "_id": "pop0002",
      "name": "แซ่บแน่",
      "rating": 4,
      "distance": 11.4,
      "image": "./assets/imgs/shop/shop6.png"
    },
    {
      "_id": "pop0003",
      "name": "ร้านบ้านสวน",
      "rating": 4,
      "distance": 8.2,
      "image": "./assets/imgs/shop/shop9.png"
    }
    ]
  },
  {
    "title": "Favorite",
    "items": [{
      "_id": "fav0001",
      "name": "แซ่บแน่",
      "rating": 4,
      "distance": 11.4,
      "image": "./assets/imgs/shop/shop6.png"
    },
    {
      "_id": "fav0002",
      "name": "ภัตตาคารหลวง",
      "rating": 5,
      "distance": 5.2,
      "image": "./assets/imgs/shop/shop8.png"
    },
    {
      "_id": "fav0003",
      "name": "Poppen",
      "rating": 4,
      "distance": 15.7,
      "image": "./assets/imgs/shop/shop5.png"
    },
    {
      "_id": "fav0004",
      "name": "บ้านขนม",
      "rating": 3,
      "distance": 4.1,
      "image": "./assets/imgs/shop/shop10.png"
    }
    ]
  }
  ];
  next();
};

exports.returnShop = function (req, res) {
  res.jsonp({
    ads: req.ads,
    hotprices: req.hotprices,
    categories: req.categories,
    shops: req.listShop
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
