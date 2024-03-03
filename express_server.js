const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080;

//Set templating engine to EJS
app.set('view engine', 'ejs');

//ID Generator function
function generateRandomString() {
  const id = Math.random().toString(36).substring(2,8);
  return id;
}
//Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Middleware to parse cookies
app.use(cookieParser());

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

//Function to get user by email from the temporary user database
const getUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

/* -----------------Temporary URL database-----------------*/
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/* -----------------Route for homepage-----------------*/
app.get("/", (req, res) => {
  res.send("Hello!");
});

/* -----------------GET request route for register page-----------------*/
app.get("/register", (req, res) => {
  res.render("register")
})


/* -----------------LOG IN GET request - set cookie username value-----------------*/
app.get("/login", (req, res) => {
  res.render("login")
})


/* -----------------POST request route for register page-----------------*/

app.post("/register", (req, res) => {
  //Generate a unique user ID
  const id = "user_" + generateRandomString();
  //Extract email and password from the form
  const { email, password } = req.body;
  
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
    password: password,
  };
  
  // Set cookie and redirect
  res.cookie('user_id', id);
  res.redirect("/urls");
})



/* -----------------LOG IN POST request - set cookie username value-----------------*/
app.post("/login", (req, res) => {
  //Extract email and password from login page
  const { email, password } = req.body;

  // Check if the user with the given email or password exists
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
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
  let email;
  //Check if user object exists
  if (user) {
    email = user.email;
  } else {
    email = null; //User does not exist
  }

  const templateVars = { 
    username: req.cookies["username"],
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
  //Check if user object was found
  if (user) {
    email = user.email;
  } else {
    email = null; //User does not exist
  }
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase,
    currentUser: user,
  };
  res.render("urls_new", templateVars);
});


/* -----------------Route for specific url -----------------*/
app.get("/urls/:id", (req, res) => {
  const currentUserId = req.cookies["user_id"]
  const user = users[currentUserId];
  let email;
  //Check if user object was found
  if (user) {
    email = user.email;
  } else {
    email = null; //User does not exist
  }
  const id = req.params.id
  const templateVars = { 
    id: id, 
    longURL: urlDatabase[id],
    username: req.cookies["username"],
    currentUser: user,
  };
  res.render("urls_show", templateVars);
});


/* -----------------Handle POST request to delete URL from database-----------------*/
app.post('/urls/:id/delete', (req, res) => {
  //Update the longn URL for given ID
  delete urlDatabase[req.params.id]
  
  //Redirect to the main URLs page
  res.redirect("/urls")
})

/* -----------------Edit current longURL-----------------*/
app.post('/urls/:id', (req, res) => {
  //Update the long URL for the given ID
  const id = req.params.id
  const newLongUrl = req.body.longURL;
  urlDatabase[id] = newLongUrl;

  //Redirect to main URLs page
  res.redirect('/urls')
})

/* -----------------Logout and clear cookies when LOGOUT is pressed-----------------*/
app.post('/logout', (req, res) => {
  //Redirect to the Log In page
  res.redirect('/login')
})

/* -----------------Update database with newly created short URL-----------------*/
app.post("/urls", (req, res) => {
  //Update the long URL with URL given in form and add it to the database
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;

  //Redirect to the long URL
  res.redirect(`/urls/${id}`);
});

/* -----------------Redirect to link embedded in short URL-----------------*/
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
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