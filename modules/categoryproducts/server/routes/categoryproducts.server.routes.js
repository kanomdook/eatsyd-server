'use strict';

/**
 * Module dependencies
 */
var categoryproductsPolicy = require('../policies/categoryproducts.server.policy'),
  categoryproducts = require('../controllers/categoryproducts.server.controller');

module.exports = function (app) {
  // Categoryproducts Routes
  app.route('/api/categoryproducts') //.all(categoryproductsPolicy.isAllowed)
    .get(categoryproducts.list);

  app.route('/api/categoryproducts').all(categoryproductsPolicy.isAllowed)
    .post(categoryproducts.create);

  app.route('/api/categoryproducts/:categoryproductId').all(categoryproductsPolicy.isAllowed)
    .get(categoryproducts.read);

  app.route('/api/categoryproducts/:categoryproductId').all(categoryproductsPolicy.isAllowed)
    .put(categoryproducts.update)
    .delete(categoryproducts.delete);

  app.route('/api/categoryproductsbyshop/:categorybyshopId').all(categoryproductsPolicy.isAllowed)
    .get(categoryproducts.cookingCategoryProductList, categoryproducts.categoryProductByShop);

  // Finish by binding the Categoryproduct middleware
  app.param('categoryproductId', categoryproducts.categoryproductByID);
  app.param('categorybyshopId', categoryproducts.shopID);

};
