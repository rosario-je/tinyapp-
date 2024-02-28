const express = require('express');
const app = express();
const PORT = 8080;

//Set templating engine to EJS
app.set('view engine', 'ejs');

function generateRandomString() {}


app.use(express.urlencoded({ extended: true }));

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

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

//Route for new urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Route for specific url 
app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const templateVars = { id: id, longURL: urlDatabase[id]};
  res.render("urls_show", templateVars);
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