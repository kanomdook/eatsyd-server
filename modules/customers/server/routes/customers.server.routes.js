'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  customers = require('../controllers/customers.server.controller');

module.exports = function (app) {
  
  //get home customer
  app.route('/api/customer/home')
    .get(customers.ads, 
      customers.hotprices, 
      customers.categories, 
      customers.listShop,
      customers.nearbyshops,
      customers.popshops,
      customers.favoriteshops, 
      customers.returnShop);

  
};
