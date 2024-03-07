const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');

//User database
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('The function getUserByEmail:', function() {

  it(' - Should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.strictEqual(user.email, testUsers[expectedUserID].email, 'User exists');
  });

  it(' - Should return a user with a valid password', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert(testUsers[expectedUserID].password === user.password, 'User exists');
  });

  it(' - Should thrown an error with a message if the user does not exists ', function() {
    const user = getUserByEmail("unexpectedUser@example.com", testUsers);
    //const expectedUserID = "userRandomID";
    assert.strictEqual(user, null, 'User does not exists');
  });
});
