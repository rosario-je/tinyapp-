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

function isLoggedInAndUrlBelongsToUser(req, urlId) {
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];
  const urlObj = urlDatabase[urlId];

  // Check if user is logged in and URL exists
  if (!user || !urlObj) {
    return false;
  }

  // Check if URL belongs to the user
  return urlObj.userID === currentUserId;
}

module.exports = {
  generateRandomString,
  getUserByEmail,
  checkForUser,
  isLoggedInAndUrlBelongsToUser
};