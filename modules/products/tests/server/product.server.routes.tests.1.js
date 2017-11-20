'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  token,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests with Token Base Authen', function () {

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

    token = '';

    // Save a user to the test db and create new Product
    user.save(function () {
      product = {
        name: 'Product name',
        detail: 'Product datail',
        category: 'Product category',
        price: 100,
        stock: 10,
        priority: 1,
        images: ['Product image'],
        user: user
      };

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

  it('should be have Token logged in with token', function (done) {
    token.should.not.be.empty();
    done();
  });

  it('should be able to save a Product if logged in with token', function (done) {
    agent.post('/api/auth/signin')
      .set('authorization', 'Bearer ' + token)
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Product
        agent.post('/api/products')
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
                // (products[0].user._id).should.equal(userId);
                (products[0].name).should.match(product.name);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get List a Product if logged in with token', function (done) {
    // Save a new products
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of product
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle product save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get products list
            var products = productsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (products[0].name).should.match(product.name);


            // Call the assertion callback
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
        // Handle product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }
        agent.get('/api/products/' + productSaveRes.body._id)
          // .send(product)
          // .expect(200)
          .end(function (productGetErr, productGetRes) {
            // Handle product save error
            if (productGetErr) {
              return done(productGetErr);
            }
            // Get product list
            var products = productGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            products.should.be.instanceof(Object).and.have.property('name', product.name);
            done();
          });
      });
  });

  it('should be able to update a Product if logged in with token', function (done) {
    // Save a new Products
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        product.name = "test product";
        agent.put('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }
            // Get a list of product
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle product save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get product list
                var products = productsGetRes.body;

                // Set assertions
                //(products[0].user.loginToken).should.equal(token);
                (products[0].name).should.match('test product');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to delete a Product if logged in with token', function (done) {
    // Save a new product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        agent.delete('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }
            // Get a list of product
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle shproductop save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get product list
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

  afterEach(function (done) {
    User.remove().exec(function () {
      Product.remove().exec(done);
    });
  });
});
