'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes

  app.route('/api/products') //.all(productsPolicy.isAllowed)
    .get(products.list);

  app.route('/api/products').all(core.requiresLoginToken, productsPolicy.isAllowed)
    .post(products.create);

  app.route('/api/products/:productId').all(core.requiresLoginToken, productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
