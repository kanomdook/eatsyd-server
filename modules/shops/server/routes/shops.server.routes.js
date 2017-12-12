'use strict';

/**
 * Module dependencies
 */
var shopsPolicy = require('../policies/shops.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  shops = require('../controllers/shops.server.controller');

module.exports = function (app) {
  // Shops Routes
  app.route('/api/shops') //.all(shopsPolicy.isAllowed)
    .get(shops.list);

  app.route('/api/shops/categories') //.all(shopsPolicy.isAllowed)
    .get(shops.getShop, shops.cookingAll, shops.cookingNew, shops.cookingOfficial, shops.cookingConsignment, shops.listFilter);

  app.route('/api/shops').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .post(shops.create);

  app.route('/api/shops/:shopId') //.all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .get(shops.read);

  app.route('/api/shops/:shopId').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .put(shops.update)
    .delete(shops.delete);

  app.route('/api/shops/createusershop/:shopId').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .put(shops.createUserByShop, shops.updateUserShop, shops.mailer);

  //get home shops
  app.route('/api/shopshome').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .get(shops.cookingHomeShop, shops.resHomeShop);

  app.route('/api/adminhome').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .get(shops.cookingAdminHome, shops.countPaging, shops.listHome);

  // /:currentpage/:keyword
  app.route('/api/filtershop').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .post(shops.filterPage);
  // // Finish by binding the Shop middleware
  app.param('shopId', shops.shopByID);
};
