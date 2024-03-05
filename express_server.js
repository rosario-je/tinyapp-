const express = require('express');
const cookieParser = require('cookie-parser')
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
//Functions used by server file
const { 
  generateRandomString, 
  getUserByEmail, 
  checkForUser, 
  users, 
  urlDatabase
} = require('./modules/lib')

//Set templating engine to EJS
app.set('view engine', 'ejs');

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Middleware to parse cookies
app.use(cookieParser());

/* -----------------Route for homepage-----------------*/
app.get("/", (req, res) => {
  res.send("Hello!");
});

/* -----------------GET request route for register page-----------------*/
app.get("/register", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];

  //Check if user object was found
   if(checkForUser(user)){
    res.redirect('/urls')
   } 

  const templateVars = { 
    username: req.cookies["user_id"],
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("register", templateVars)
})


/* -----------------LOG IN GET request - set cookie username value-----------------*/
app.get("/login", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];

  //Check if user object was found
  if(checkForUser(user)){
    res.redirect('/urls')
   } 
  
  const templateVars = { 
    username: req.cookies["user_id"],
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("login", templateVars)
})


/* -----------------POST request route for register page-----------------*/

app.post("/register", (req, res) => {
  //Generate a unique user ID
  const id = "user_" + generateRandomString();
  //Extract email and password from the form
  const { email, password } = req.body;

  //Hashes password entered in form for security
  const hashedPassword = bcrypt.hashSync(password, 10)
  
  // Throw an error if the user fails to provide an email or password
  if (!email || !password) {
    return res.status(400).send("Please enter a valid email and password.");
  }
  
  // Check if the email is already registered with function
  if (getUserByEmail(email)) {
    return res.status(400).send("This email is already registered.");
  }
  
  //Add the new user
  users[id] = {
    id: id,
    email: email,
    password: hashedPassword,
  };
  console.log(users)
  // Set cookie and redirect
  res.cookie('user_id', id);
  res.redirect("/urls");
})



/* -----------------LOG IN POST request - set cookie username value-----------------*/
app.post("/login", (req, res) => {
  //Extract email and password from login page
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  //Check if the user or hashed user password exists
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid email or password");
  }

  // Set cookie only if the user exists
  res.cookie('user_id', user.id);
  res.redirect("/urls");
});

/* -----------------Route for urls main page-----------------*/
app.get("/urls", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];
  
  //Check if user object exists
  checkForUser(user)

  const templateVars = { 
    username: req.cookies["user_id"],
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("urls_index", templateVars);
});

/* -----------------Route for new urls-----------------*/
app.get("/urls/new", (req, res) => {
  //Extract user information from cookies
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];
  let email;
  //Check if user object was not found
  if (checkForUser(user) === false){
    email = null; //User does not exist
    res.redirect('/login')
  }

  const templateVars = { 
    username: req.cookies["user_id"],
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("urls_new", templateVars);
});


/* -----------------GET Request Route for specific url -----------------*/
app.get("/urls/:id", (req, res) => {
  //Extract current user ID
  const currentUserId = req.cookies["user_id"]
  //Select specific user obj matching the current user ID
  const user = users[currentUserId];
  const id = req.params.id
 
  //Check if user object was found
  checkForUser(user)

  const templateVars = { 
    id: id, 
    longURL: urlDatabase[id].longURL,
    username: req.cookies["user_id"],
    currentUser: user,
  };
  //Check if the id for the long URL exists
  if (!templateVars.longURL) {
    res.status(401).send("<h1>This ID does not exists</h1>")
  } else {
    //Check if the user owns the URL
    if (urlDatabase[id].userID !== currentUserId){
      res.status(403).send("<h1>You don't have permission to view this URL</h1>")
    } else {
      res.render("urls_show", templateVars);
    }
  }
  
});


/* -----------------Handle POST request to delete URL from database-----------------*/
app.post('/urls/:id/delete', (req, res) => {
  //Update the longn URL for given ID
  const currentUserId = req.cookies["user_id"]
  const id = req.params.id
  
  //Check if the URL exists in the database
  if (!urlDatabase[id].longURL){
    res.status(403).send("<h1>This URL does not exists</h1>")
    setTimeout(() => {
      res.redirect('/urls');
    },2000)
  } 
  //Check if the user is the owner of the URL
  else if (urlDatabase[id].userID !== currentUserId){
    res.status(403).send("<h1>You don't have permission to view this URL</h1>")
    setTimeout(() => {
      res.redirect('/urls');
    },2000)
  }
  
  delete urlDatabase[req.params.id]
  
  //Redirect to the main URLs page
  res.redirect("/urls")
})

/* -----------------Edit current longURL-----------------*/
app.post('/urls/:id', (req, res) => {
  //Update the long URL for the given ID
  const id = req.params.id
  const newLongUrl = req.body.longURL;
  urlDatabase[id].longURL = newLongUrl;

  //Redirect to main URLs page
  res.redirect('/urls')
})

/* -----------------Logout and clear cookies when LOGOUT is pressed-----------------*/
app.post('/logout', (req, res) => {
  //Clear any cookies when logged out
  res.clearCookie('user_id');
  //Redirect to the Log In page
  res.redirect('/login')
})

/* -----------------Update database with newly created short URL-----------------*/
app.post("/urls", (req, res) => {
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];

  //Check if user object was found
  if (!user) {
    res.status(401).send("<h1>You cannot shorten URLs without being logged in</h1>")
  } else {
    //Update the long URL with URL given in form and add it to the database
    const longURL = req.body.longURL;
    if (longURL === ''){
      res.send("<h1>Enter a valid URL</h1>")
      res.redirect("urls/new");
    }
    const id = generateRandomString();
    //Add Short URL id object
    urlDatabase[id] = {
      longURL: longURL,
      userID: req.cookies['user_id']
    }
    urlDatabase[id].longURL = longURL;
    //Redirect to the long URL
    res.redirect(`/urls/${id}`);
  }
});

/* -----------------Redirect to link embedded in short URL-----------------*/
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});