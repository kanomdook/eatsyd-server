'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, _user, admin;

/**
 * User routes tests
 */
describe('User Token tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create a new user
        _user = {
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        };

        user = new User(_user);

        // Save a user to the test db and create new article
        user.save(function (err) {
            should.not.exist(err);
            done();
        });
    });


    it('should be able to login successfully and have token', function (done) {

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }
                signinRes.body.loginToken.should.not.be.empty();
                //done();
                agent.get('/api/protected')
                    .set('authorization', 'Bearer ' + signinRes.body.loginToken)
                    .expect(200)
                    .end(function (signinErr, signinResToken) {
                        // Handle signin error
                        if (signinErr) {
                            return done(signinErr);
                        }
                        signinResToken.body.firstName.should.equal(_user.firstName);
                        done();
                    });
            });

        // var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1YTUxZGY5N2JkMTIyYmM3MjhjMjQxOWYiLCJzYWx0IjoieC8za3BYN2hsTDEyYnJHbEd1UHpzQT09IiwiZGlzcGxheU5hbWUiOiJGdWxsIE5hbWUiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwicHJvdmlkZXIiOiJsb2NhbCIsIl9fdiI6MCwiY3JlYXRlZCI6IjIwMTgtMDEtMDdUMDg6NTE6MzUuMTYxWiIsInJvbGVzIjpbInVzZXIiXSwicHJvZmlsZUltYWdlVVJMIjoibW9kdWxlcy91c2Vycy9jbGllbnQvaW1nL3Byb2ZpbGUvZGVmYXVsdC5wbmciLCJwYXNzd29yZCI6IlVVcHVPb1plWExuL0pOVDdKQUU5b0VFSVdtMVJraytLdzMyZWU3SXBJMERMVjlrYStuRlBsd0xLKzhNNFc3NmoxaWlUSGdnckMxU1MzOGhkK3pqdk1RPT0iLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJsYXN0TmFtZSI6Ik5hbWUiLCJmaXJzdE5hbWUiOiJGdWxsIn0.VO9O4XxXgxKN9wqGN7yB2r-V03eKJOlz7c7K6rFvmYk';
        // agent.get('/api/protected')
        //     .set('authorization', 'Bearer ' + token)
        //     .expect(200)
        //     .end(function (signinErr, signinResToken) {
        //         // Handle signin error
        //         if (signinErr) {
        //             return done(signinErr);
        //         }
        //         signinResToken.body.firstName.should.equal(_user.firstName);
        //         done();
        //     });

    });

    afterEach(function (done) {
        User.remove().exec(done);
    });
});
