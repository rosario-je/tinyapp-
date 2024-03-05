
/* -----------------Temporary user database-----------------*/
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/* -----------------Temporary URL database-----------------*/
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//ID Generator function
function generateRandomString() {
  const id = Math.random().toString(36).substring(2,8);
  return id;
}

//Function to get user by email from the temporary user database
const getUserByEmail = (email, database) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

//Function to check if a user exists;
const checkForUser = (user) => {
  if (user){
    email = user.email

  } else {
    return false;
  }
}

module.exports = { 
  generateRandomString, 
  getUserByEmail, 
  checkForUser, 
  users, 
  urlDatabase
}