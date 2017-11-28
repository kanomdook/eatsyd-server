'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Shop = mongoose.model('Shop'),
  Categoryshop = mongoose.model('Categoryshop'),
  Categoryproduct = mongoose.model('Categoryproduct'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  categoryshop,
  categoryproduct,
  shop,
  agent,
  credentials,
  user,
  token,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests with token', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    token = '';
    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    categoryshop = new Categoryshop({
      name: 'อาหารและเครื่องดื่ม'
    });

    categoryproduct = new Categoryproduct({
      name: 'อาหาร',
      priority: 1,
      image: 'image cate product',
      user: user,
      shop: shop
    });

    shop = new Shop({
      name: 'Shop name',
      name_eng: 'Shop name english',
      detail: 'Shop Detail',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '77/7',
        addressdetail: 'in font of 7-eleven',
        subdistinct: 'Lumlukka',
        distinct: 'Lumlukka',
        province: 'BKK',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      times: [{
        description: 'all days',
        timestart: '08.00',
        timeend: '20.00',
        days: ['mon', 'thu', 'sun']
      }],
      coverimage: 'https://img.wongnai.com/p/l/2016/11/29/15ff08373d31409fb2f80ebf4623589a.jpg',
      promoteimage: ['http://ed.files-media.com/ud/images/1/22/63943/IMG_7799_Cover.jpg'],
      isactiveshop: false,
      importform: 'manual',
      categories: categoryshop,
      user: user
    });
    // Save a user to the test db and create new Product
    user.save(function () {
      shop.save(function () {
        categoryproduct.save(function () {
          product = {
            name: 'Product name',
            price: 50,
            priorityofcate: 1,
            images: ['https://simg.kapook.com/o/photo/410/kapook_world-408206.jpg', 'https://f.ptcdn.info/408/051/000/oqi6tdf9uS1811y1XHx-o.png'],
            user: user,
            categories: categoryproduct,
            shop: shop
          };
        });
      });


      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          signinRes.body.loginToken.should.not.be.empty();
          token = signinRes.body.loginToken;
          done();
        });
    });
  });


  it('should be have Token logged in', function (done) {
    token.should.not.be.empty();
    done();
  });

  it('should be able to save a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of Products
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle Products save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get Products list
            var products = productsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (products[0].name).should.match('Product name');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should be able to update a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }
        // var products = productSaveRes.body;
        // (products.name).should.equal('Product name');
        product.name = "test Product";
        agent.put('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle Product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }

            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                //(products[0].user.loginToken).should.equal(token);
                (products[0].name).should.equal('test Product');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to delete a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        agent.delete('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle Product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }
            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                //(products[0].user.loginToken).should.equal(token);
                (products.length).should.match(0);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get List a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of Products
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle Products save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get Products list
            var products = productsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (products.length).should.match(1);
            (products[0].name).should.match(product.name);
            (products[0].images[0]).should.match(product.images[0]);
            (products[0].images[1]).should.match(product.images[1]);
            (products[0].price).should.match(product.price);
            (products[0].priorityofcate).should.match(product.priorityofcate);
            done();
          });
      });
  });

  it('should be able to get By ID a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        var productObj = productSaveRes.body;
        agent.get('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .end(function (productGetErr, productsGetRes) {
            // Handle Product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Get Products list
            // console.log(JSON.stringify(productsGetRes.body));
            var products = productsGetRes.body;

            // Set assertions
            // (products[0].user.loginToken).should.equal(token);
            (products.name).should.match('Product name');
            (products.shop.name).should.match(shop.name);
            (products.categories.name).should.match(product.categories.name);

            done();
          });
      });
  });

  it('should be able to get List a Product by Shop if logged in with token', function (done) {
    var ProductObj = new Product(product);
    // Get a list of Products
    ProductObj.save();
    agent.get('/api/productsbyshop/' + shop.id)
      .set('authorization', 'Bearer ' + token)
      .end(function (productsGetErr, productsGetRes) {
        // Handle Products save error
        if (productsGetErr) {
          return done(productsGetErr);
        }

        // Get Products list
        var products = productsGetRes.body;

        // Set assertions
        //(products[0].user.loginToken).should.equal(token);
        (products.items.length).should.match(1);
        (products.items[0].name).should.match(product.name);
        (products.items[0].images).should.match(product.images[0]);
        (products.items[0].price).should.match(product.price);
        (products.items[0].priorityofcate).should.match(product.priorityofcate);
        (products.items[0].categories.name).should.match(product.categories.name);
        done();
      });
  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Shop.remove().exec(function () {
        Categoryproduct.remove().exec(function () {
          Product.remove().exec(done);
        });
      });
    });
  });
});
