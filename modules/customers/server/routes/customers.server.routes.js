'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  customers = require('../controllers/customers.server.controller');

module.exports = function (app) {
  
  //get home customer
  app.route('/api/customer/home/:lat/:lng')
    .get(customers.ads, 
      customers.hotprices, 
      customers.hotpricesItm1,
      customers.hotpricesItm2,
      customers.categories, 
      customers.listShop,
      customers.nearbyshops,
      customers.popshops,
      customers.favoriteshops, 
      customers.returnShop);

  app.route('/api/customer/categoryshop/:cateid')
  .get(customers.getshopbycate);

  app.route('/api/customer/shops/:condition')
  .get(customers.nearbyshops,
    customers.popshops,
    customers.favoriteshops);

      app.param('lat', customers.getlat);
      app.param('lng', customers.getlng);
      app.param('cateid', customers.getcateid);
      app.param('condition', customers.getcondition);
  
};
