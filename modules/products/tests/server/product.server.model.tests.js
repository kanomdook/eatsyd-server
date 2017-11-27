'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category'),
  Currency = mongoose.model('Currency'),
  Product = mongoose.model('Product');

/**
 * Globals
 */
var user,
  category,
  currencies,
  product;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    category = new Category({
      name: 'เครื่องดื่ม'
    });

    currencies = new Currency({
      name: 'THB'
    });

    user.save(function () {
      currencies.save(function () {
        category.save(function () {
          product = new Product({
            name: 'Product Name',
            name_eng: 'Product Name english',
            detail: 'Product detail',
            categories: category,
            currency: currencies,
            prices: [{
              name: 'hot',
              price: 50
            }],
            stock: 10,
            priority: 1,
            images: ['image'],
            user: user
          });
          done();
        });
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate name', function (done) {
      var product2 = new Product(product);

      return product.save(function (err) {
        should.not.exist(err);
        product2.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });

    it('should be able to show an error when try to save without prices', function (done) {
      product.prices = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      Category.remove().exec(function () {
        Currency.remove().exec(function () {
          User.remove().exec(function () {
            done();
          });
        });
      });
    });
  });
});
