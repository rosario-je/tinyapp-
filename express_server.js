const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
//Functions used by server file
const { 
  generateRandomString, 
  getUserByEmail, 
  checkForUser,
  isLoggedInAndUrlBelongsToUser 
} = require('./helpers');

const { users, urlDatabase } = require('./database');

//Set templating engine to EJS
app.set('view engine', 'ejs');

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Middleware to parse cookies
app.use(cookieSession({
  name: 'session',
  secret: 'secretCookie',

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


/* -----------------Route for homepage-----------------*/
app.get("/", (req, res) => {
  //Extract user information from cookies(if any)
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];

  if (checkForUser(user)) {
    return res.redirect('/urls');
  }
  return res.redirect('/login');
});

/* -----------------GET request route for register page-----------------*/
app.get("/register", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];

  if (checkForUser(user)) {
    return res.redirect('/urls');
  }
  const templateVars = {
    userId: req.session.user_id,
    urls: urlDatabase,
    currentUser: user,
  };
  return res.render("register", templateVars);
});


/* -----------------LOG IN GET request - set cookie userId value-----------------*/
app.get("/login", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];
  const templateVars = {
    userId: req.session.user_id,
    urls: urlDatabase,
    currentUser: user,
  };

  //Check if user object was found
  if (checkForUser(user)) {
    return res.redirect('/urls');
  }

  return res.render("login", templateVars);
});


/* -----------------POST request route for register page-----------------*/
app.post("/register", (req, res) => {
  
  //Extract email and password from the form
  const { email, password } = req.body;
  const id = "user_" + generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  const currentUserId = req.session.user_id;
  const currentUser = users[currentUserId];

  if (!email || !password) {
    return res.status(400).render('partials/_errorHeader.ejs', {message: "Please enter a valid email and password",currentUser: false});
  }
  // Check if the email is already registered with function
  if (getUserByEmail(email)) {
    return res.status(400).render('partials/_errorHeader.ejs', {message: "This email is already registered",currentUser});
  }
  //Add the new user
  users[id] = {
    id: id,
    email: email,
    password: hashedPassword,
  };

  // Set cookie and redirect
  req.session.user_id = id;
  return res.redirect("/urls");
});

/* -----------------LOG IN POST request - set cookie userId value-----------------*/
app.post("/login", (req, res) => {
  //Extract email and password from login page
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  const currentUserId = req.session.user_id;
  const currentUser = users[currentUserId];

  //Check if the user or hashed user password exists
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).render('partials/_errorHeader.ejs', {message: "Invalid password or email", currentUser});
  }

  // Set cookie only if the user exists
  req.session.user_id = user.id;
  res.redirect("/urls");
});

/* -----------------Route for urls main page-----------------*/
app.get("/urls", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];

  const templateVars = {
    userId: req.session.user_id,
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("urls_index", templateVars);
});

/* -----------------Route for new urls-----------------*/
app.get("/urls/new", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];

  //Check if user is logged in to create a new URL
  if (!checkForUser(user)) {
    return res.status(302).redirect('/login');
  }
  const templateVars = {
    userId: req.session.user_id,
    urls: urlDatabase,
    currentUser: user,
  };
  return res.render("urls_new", templateVars);
});

/* -----------------GET Request Route for specific url -----------------*/
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const urlObj = urlDatabase[id];

  const currentUserId = req.session.user_id;
  const user = users[currentUserId];
  
  //Check if the URL exists
  if (!urlObj) {
    return res.status(404).render('partials/_errorHeader.ejs', {message: "URL not found", currentUser: user});
  }
  const templateVars = {
    id: id,
    longURL: urlObj.longURL,
    userId: currentUserId,
    currentUser: users[currentUserId],
    urlId: urlObj.userID
  };

  /*
  -Check if the URL owner matches the current user
  -Used this verification method instead of helper function for required values by EJS Temaplte
  */
  if (urlObj.userID !== currentUserId) {
    return res.status(403).render("urls_show", templateVars);
  }
  return res.render("urls_show", templateVars);
});


/* -----------------Handle POST request to delete URL from database-----------------*/
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;

  // Check user and URL
  if (!isLoggedInAndUrlBelongsToUser(req, id)) {
    return res.status(403).send("<h1>You don't have permission to delete this URL</h1>");
  }

  // Delete URL and redirect
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

/* -----------------Edit current longURL-----------------*/
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const newLongUrl = req.body.longURL;

  // Check user and URL 
  if (!isLoggedInAndUrlBelongsToUser(req, id)) {
    return res.status(403).send("<h1>You don't have permission to edit this URL</h1>");
  }

  // Update longURL and redirect
  urlDatabase[id].longURL = newLongUrl;
  res.redirect('/urls');
});

/* -----------------Logout and clear cookies when LOGOUT is pressed-----------------*/
app.post('/logout', (req, res) => {
  //Clear any cookies when logged out
  req.session = null;
  return res.redirect('/login');
});

/* -----------------Update database with newly created short URL-----------------*/
app.post("/urls", (req, res) => {
  const currentUserId = req.session.user_id;
  const user = users[currentUserId];

  //Check if user object was found
  if (!user) {
    res.status(401).render('partials/_errorHeader.ejs', {message: "You cannot shorten URLs without being logged in", currentUser: user});
  } else {
    //Update the long URL with URL given in form and add it to the database
    const longURL = req.body.longURL;
    if (longURL === '') {
      return res.redirect("urls/new");
    }
    const id = generateRandomString();
    //Add Short URL id object
    urlDatabase[id] = {
      longURL: longURL,
      userID: req.session['user_id']
    };
    urlDatabase[id].longURL = longURL;
    //Redirect to the long URL
    return res.redirect(`/urls/${id}`);
  }
});

/* -----------------Redirect to link embedded in short URL-----------------*/
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const urlObj = urlDatabase[id];

  // Redirect to /urls/:id with the same ID
  if (!urlObj) {
    return res.redirect("/urls/" + id);  
  }
  const longURL = urlObj.longURL;
  return res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Export required by server tests cases
module.exports = app;