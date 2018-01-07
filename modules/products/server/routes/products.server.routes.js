'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products') //.all(productsPolicy.isAllowed)
    .get(products.list);

  app.route('/api/products').all(productsPolicy.isAllowed)
    .post(products.create);

  app.route('/api/products/:productId') //.all(productsPolicy.isAllowed)
    .get(products.read);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/productsbyshop/:productbyshopId').all(productsPolicy.isAllowed)
    .get(products.cookingProductList, products.productByShop);

  app.route('/api/products_picture').post(products.changeProductPicture);
  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
  app.param('productbyshopId', products.shopID);

};
