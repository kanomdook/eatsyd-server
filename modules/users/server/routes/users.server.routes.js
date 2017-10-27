'use strict';

module.exports = function (app) {
  // User Routes
  var core = require('../../../core/server/controllers/core.server.controller'),
    users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  // app.route('/api/users/me').post(core.requiresLoginToken, users.me);
  app.route('/api/users/me')
  .get(users.me)
  .post(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
