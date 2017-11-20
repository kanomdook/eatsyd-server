'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shop');

/**
 * Globals
 */
var user,
  shop;

/**
 * Unit tests
 */
describe('Shop Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      shop = new Shop({
        name: 'Shop name',
        detail: 'Shop Detail',
        address: {
          address: '77/7',
          subdistinct: 'Lumlukka',
          distinct: 'Lumlukka',
          province: 'BKK',
          postcode: '12150',
          lat: '13.9338949',
          lng: '100.6827773'
        },
        tel: '0894447208',
        profileimage: 'profileimage',
        coverimage: 'coverimage',
        isactiveshop: 'active',
        importform: 'manual',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return shop.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      shop.name = '';

      return shop.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to show an error when try to save duplicate name', function (done) {
      var shop2 = new Shop(shop);

      return shop.save(function (err) {
        should.not.exist(err);
        shop2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });


  });

  afterEach(function (done) {
    Shop.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
