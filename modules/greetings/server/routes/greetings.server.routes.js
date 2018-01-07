'use strict';

/**
 * Module dependencies
 */
var greetingsPolicy = require('../policies/greetings.server.policy'),
  greetings = require('../controllers/greetings.server.controller');

module.exports = function (app) {
  // Greetings Routes
  app.route('/api/greetings').all(greetingsPolicy.isAllowed)
    .get(greetings.list)
    .post(greetings.create);

  app.route('/api/greetings/:greetingId').all(greetingsPolicy.isAllowed)
    .get(greetings.read)
    .put(greetings.update)
    .delete(greetings.delete);

  // Finish by binding the Greeting middleware
  app.param('greetingId', greetings.greetingByID);
};
