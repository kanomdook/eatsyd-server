'use strict';

/**
 * Module dependencies
 */
var categoryproductsPolicy = require('../policies/categoryproducts.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  categoryproducts = require('../controllers/categoryproducts.server.controller');

module.exports = function (app) {
  // Categoryproducts Routes
  app.route('/api/categoryproducts') //.all(core.requiresLoginToken, categoryproductsPolicy.isAllowed)
    .get(categoryproducts.list);

  app.route('/api/categoryproducts').all(core.requiresLoginToken, categoryproductsPolicy.isAllowed)
    .post(categoryproducts.create);

  app.route('/api/categoryproducts/:categoryproductId').all(core.requiresLoginToken, categoryproductsPolicy.isAllowed)
    .get(categoryproducts.read);

  app.route('/api/categoryproducts/:categoryproductId').all(core.requiresLoginToken, categoryproductsPolicy.isAllowed)
    .put(categoryproducts.update)
    .delete(categoryproducts.delete);

  app.route('/api/categoryproductsbyshop/:categorybyshopId').all(core.requiresLoginToken, categoryproductsPolicy.isAllowed)
    .get(categoryproducts.cookingCategoryProductList, categoryproducts.categoryProductByShop);

  // Finish by binding the Categoryproduct middleware
  app.param('categoryproductId', categoryproducts.categoryproductByID);
  app.param('categorybyshopId', categoryproducts.shopID);

};
