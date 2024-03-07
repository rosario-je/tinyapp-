
const chai = require('chai');
const chaiHttp = require('chai-http');

// Set up chai assertion styles
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../express_server');
const appUrl = 'http://localhost:8080';
const agent = chai.request.agent(appUrl);


describe('Server Tests', function() {

  // Test case for GET /
  it('GET / should redirect to /login with status code 302 if the user is not logged in', function() {
    return agent
      .get('/').redirects(0)
      .end((err, res, body) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(`/login`);
        expect(res).to.have.status(302);
      });
  });

  // Test case for GET /urls/new
  it('GET /urls/new should redirect to /login with status code 302 if the user is not logged in', function() {
    return agent
      .get('/urls/new').redirects(0)
      .end((err, res, body) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(`/login`);
        expect(res).to.have.status(302);
      });

  });

  // Test case for GET /urls/NOTEXISTS
  it('GET /urls/NOTEXISTS should return status code 404 if the URL does not exist', function() {
    return agent
      .get('/urls/NOTEXISTS')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  // Test case for GET /urls/b2xVn2
  it('GET /urls/b6UTxQ should return status code 403 if the user is not logged in', function() {
    return agent
      .get('/urls/b6UTxQ')
      .then(function(res) {
        expect(res).to.have.status(403);
      });
  });
});



