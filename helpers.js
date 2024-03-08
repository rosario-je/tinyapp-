const { users, urlDatabase } = require('./database');

//ID Generator function
function generateRandomString() {
  const id = Math.random().toString(36).substring(2,8);
  return id;
}

//Function to get user by email from the temporary user database
const getUserByEmail = (email, urlDatabase) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

//Function to check if a user exists;
const checkForUser = (user) => !!user;


module.exports = {
  generateRandomString,
  getUserByEmail,
  checkForUser,
};