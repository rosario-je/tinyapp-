const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert(testUsers[expectedUserID].email === user.email, 'User exists');
  });

  it(' - Should return a user with a valid password email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert(testUsers[expectedUserID].password === user.password, 'User exists');
  });

  it(' - Should thrown an error with a message if the user does not exists ', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert(testUsers[expectedUserID] !== user, 'User does not exists');
  });
});

