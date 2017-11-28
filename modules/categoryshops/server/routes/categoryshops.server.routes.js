'use strict';

/**
 * Module dependencies
 */
var categoryshopsPolicy = require('../policies/categoryshops.server.policy'),
  categoryshops = require('../controllers/categoryshops.server.controller');

module.exports = function(app) {
  // Categoryshops Routes
  app.route('/api/categoryshops').all(categoryshopsPolicy.isAllowed)
    .get(categoryshops.list)
    .post(categoryshops.create);

  app.route('/api/categoryshops/:categoryshopId').all(categoryshopsPolicy.isAllowed)
    .get(categoryshops.read)
    .put(categoryshops.update)
    .delete(categoryshops.delete);

  // Finish by binding the Categoryshop middleware
  app.param('categoryshopId', categoryshops.categoryshopByID);
};
