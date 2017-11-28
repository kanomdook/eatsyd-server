'use strict';

/**
 * Module dependencies
 */
var categoryproductsPolicy = require('../policies/categoryproducts.server.policy'),
  categoryproducts = require('../controllers/categoryproducts.server.controller');

module.exports = function(app) {
  // Categoryproducts Routes
  app.route('/api/categoryproducts').all(categoryproductsPolicy.isAllowed)
    .get(categoryproducts.list)
    .post(categoryproducts.create);

  app.route('/api/categoryproducts/:categoryproductId').all(categoryproductsPolicy.isAllowed)
    .get(categoryproducts.read)
    .put(categoryproducts.update)
    .delete(categoryproducts.delete);

  // Finish by binding the Categoryproduct middleware
  app.param('categoryproductId', categoryproducts.categoryproductByID);
};
