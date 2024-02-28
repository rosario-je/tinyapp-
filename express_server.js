const express = require('express');
const app = express();
const PORT = 8080;

//Set templating engine to EJS
app.set('view engine', 'ejs');

//ID Generator
function generateRandomString() {
  const id = Math.random().toString(36).substring(2,8);
  return id;
}

app.use(express.urlencoded({ extended: true }));

//Mini Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//Route for homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});




//Route for urls main page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.post("/login", (req, res) => {
  const username = req.body.username
  res.cookie('username', username, { path: '/login', secure: true })
  res.cookie = ('username', username)
  res.redirect("/urls")
})


//Route for new urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});




//Route for specific url 
app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const templateVars = { id: id, longURL: urlDatabase[id] };
  res.render("urls_show", templateVars);
});



//Handle POST request to delete URL from database
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
})

// Edit current longURL
app.post('/urls/:id', (req, res) => {
  const id = req.params.id
  const newLongUrl = req.body.longURL;
  urlDatabase[id] = newLongUrl;
  res.redirect('/urls')
})


//Update database with newly created short URL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

//Redirect to link embedded in short URL
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