'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoryproduct = mongoose.model('Categoryproduct'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categoryproduct;

/**
 * Categoryproduct routes tests
 */
describe('Categoryproduct CRUD tests', function () {

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

    // Save a user to the test db and create new Categoryproduct
    user.save(function () {
      categoryproduct = {
        name: 'Categoryproduct name'
      };

      done();
    });
  });

  it('should be able to save a Categoryproduct if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Categoryproduct
        agent.post('/api/categoryproducts')
          .send(categoryproduct)
          .expect(200)
          .end(function (categoryproductSaveErr, categoryproductSaveRes) {
            // Handle Categoryproduct save error
            if (categoryproductSaveErr) {
              return done(categoryproductSaveErr);
            }

            // Get a list of Categoryproducts
            agent.get('/api/categoryproducts')
              .end(function (categoryproductsGetErr, categoryproductsGetRes) {
                // Handle Categoryproducts save error
                if (categoryproductsGetErr) {
                  return done(categoryproductsGetErr);
                }

                // Get Categoryproducts list
                var categoryproducts = categoryproductsGetRes.body;

                // Set assertions
                (categoryproducts[0].user._id).should.equal(userId);
                (categoryproducts[0].name).should.match('Categoryproduct name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Categoryproduct if not logged in', function (done) {
    agent.post('/api/categoryproducts')
      .send(categoryproduct)
      .expect(403)
      .end(function (categoryproductSaveErr, categoryproductSaveRes) {
        // Call the assertion callback
        done(categoryproductSaveErr);
      });
  });

  it('should not be able to save an Categoryproduct if no name is provided', function (done) {
    // Invalidate name field
    categoryproduct.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Categoryproduct
        agent.post('/api/categoryproducts')
          .send(categoryproduct)
          .expect(400)
          .end(function (categoryproductSaveErr, categoryproductSaveRes) {
            // Set message assertion
            (categoryproductSaveRes.body.message).should.match('Please fill Categoryproduct name');

            // Handle Categoryproduct save error
            done(categoryproductSaveErr);
          });
      });
  });

  it('should be able to update an Categoryproduct if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Categoryproduct
        agent.post('/api/categoryproducts')
          .send(categoryproduct)
          .expect(200)
          .end(function (categoryproductSaveErr, categoryproductSaveRes) {
            // Handle Categoryproduct save error
            if (categoryproductSaveErr) {
              return done(categoryproductSaveErr);
            }

            // Update Categoryproduct name
            categoryproduct.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categoryproduct
            agent.put('/api/categoryproducts/' + categoryproductSaveRes.body._id)
              .send(categoryproduct)
              .expect(200)
              .end(function (categoryproductUpdateErr, categoryproductUpdateRes) {
                // Handle Categoryproduct update error
                if (categoryproductUpdateErr) {
                  return done(categoryproductUpdateErr);
                }

                // Set assertions
                (categoryproductUpdateRes.body._id).should.equal(categoryproductSaveRes.body._id);
                (categoryproductUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Categoryproducts if not signed in', function (done) {
    // Create new Categoryproduct model instance
    var categoryproductObj = new Categoryproduct(categoryproduct);

    // Save the categoryproduct
    categoryproductObj.save(function () {
      // Request Categoryproducts
      request(app).get('/api/categoryproducts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Categoryproduct if not signed in', function (done) {
    // Create new Categoryproduct model instance
    var categoryproductObj = new Categoryproduct(categoryproduct);

    // Save the Categoryproduct
    categoryproductObj.save(function () {
      request(app).get('/api/categoryproducts/' + categoryproductObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', categoryproduct.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Categoryproduct with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categoryproducts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categoryproduct is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Categoryproduct which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categoryproduct
    request(app).get('/api/categoryproducts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Categoryproduct with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Categoryproduct if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Categoryproduct
        agent.post('/api/categoryproducts')
          .send(categoryproduct)
          .expect(200)
          .end(function (categoryproductSaveErr, categoryproductSaveRes) {
            // Handle Categoryproduct save error
            if (categoryproductSaveErr) {
              return done(categoryproductSaveErr);
            }

            // Delete an existing Categoryproduct
            agent.delete('/api/categoryproducts/' + categoryproductSaveRes.body._id)
              .send(categoryproduct)
              .expect(200)
              .end(function (categoryproductDeleteErr, categoryproductDeleteRes) {
                // Handle categoryproduct error error
                if (categoryproductDeleteErr) {
                  return done(categoryproductDeleteErr);
                }

                // Set assertions
                (categoryproductDeleteRes.body._id).should.equal(categoryproductSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Categoryproduct if not signed in', function (done) {
    // Set Categoryproduct user
    categoryproduct.user = user;

    // Create new Categoryproduct model instance
    var categoryproductObj = new Categoryproduct(categoryproduct);

    // Save the Categoryproduct
    categoryproductObj.save(function () {
      // Try deleting Categoryproduct
      request(app).delete('/api/categoryproducts/' + categoryproductObj._id)
        .expect(403)
        .end(function (categoryproductDeleteErr, categoryproductDeleteRes) {
          // Set message assertion
          (categoryproductDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categoryproduct error error
          done(categoryproductDeleteErr);
        });

    });
  });

  it('should be able to get a single Categoryproduct that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Categoryproduct
          agent.post('/api/categoryproducts')
            .send(categoryproduct)
            .expect(200)
            .end(function (categoryproductSaveErr, categoryproductSaveRes) {
              // Handle Categoryproduct save error
              if (categoryproductSaveErr) {
                return done(categoryproductSaveErr);
              }

              // Set assertions on new Categoryproduct
              (categoryproductSaveRes.body.name).should.equal(categoryproduct.name);
              should.exist(categoryproductSaveRes.body.user);
              should.equal(categoryproductSaveRes.body.user._id, orphanId);

              // force the Categoryproduct to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Categoryproduct
                    agent.get('/api/categoryproducts/' + categoryproductSaveRes.body._id)
                      .expect(200)
                      .end(function (categoryproductInfoErr, categoryproductInfoRes) {
                        // Handle Categoryproduct error
                        if (categoryproductInfoErr) {
                          return done(categoryproductInfoErr);
                        }

                        // Set assertions
                        (categoryproductInfoRes.body._id).should.equal(categoryproductSaveRes.body._id);
                        (categoryproductInfoRes.body.name).should.equal(categoryproduct.name);
                        should.equal(categoryproductInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Categoryproduct.remove().exec(done);
    });
  });
});
