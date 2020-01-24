const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const app = express();
const { checkEmail } = require('./helpers');
const PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const urlsForUser = function(id) {
  let match = {};
  for (let key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      match[key] = urlDatabase[key].longURL;
    }
  }
  return match;
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


const generateRandomString = function() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = chars.length;
  for (let i = 1; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


//root login page for user
app.get("/", (req, res) => {
  if (!req.session["user_id"]) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});


// renders Create new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session["user_id"]]
  };
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});


//renders tinyurl of and edit new url,
app.get("/urls/:shortURL", (req, res) => {

  if (!req.session["user_id"]) {
    res.status(400).send("Please login first to edit");
  }

  if (!urlDatabase[req.params.shortURL]) {
    res.status(400).send("URL doesn't exist.");
  }

  if (req.session["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.status(400).send(`Permission to edit URL not granted.`);
  }

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session["user_id"]]
  };
  res.render("urls_show", templateVars);
});


//renders Register page
app.get("/register", (req, res) => {
  res.render("urls_register");
});


//renders Login page
app.get("/login", (req, res) => {
  res.render("urls_login");
});
  

//redirects to website,works with new keys
app.get("/u/:shortURL", (req, res) => {
  let longURL = "http://" + urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//renders my urls index
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users,
    userId: req.session.user_id,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});


// create reg handler and redirect user to urls
app.post("/register", (req, res) => {

  //empty email box
  if (!req.body.email) {
    res.status(400).send("Please enter an email");
  }
  
  //empty pass box
  if (!req.body.password) {
    res.status(400).send("Enter a password");
  }

  // if registered user tries again
  if (checkEmail(req.body.email, users)) {
    res.status(400).send("Email already exists");
  }
 
  let randoUserId = generateRandomString();
  users[randoUserId] = {
    id: randoUserId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session["user_id"] = randoUserId;
  res.redirect("/urls");
});
 

//logs in and gives cookies
app.post("/login", (req, res) => {
  let user = checkEmail(req.body.email, users);

  if (!user) {
    res.status(403).send("Please try again with correct credentials");

  } else if (!bcrypt.compareSync(req.body.password, users[user.id].password)) {
    res.status(403).send("Please try again with correct password");

  } else {
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});


//when hit logout button redirects to urls
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//allows user to edit then redirects to urls
app.post("/urls/:shortURL", (req, res) => {
  const newURL = req.body.newURL;
  const id = req.params.shortURL;
  if (urlDatabase[id].userID !== req.session.user_id) {
    res.status(403).send("ERROR: Cannot edit");
  } else {
    urlDatabase[id].longURL = newURL;
    res.redirect(`/urls/${id}`);
  }
});


//creates new shorturl, added new key
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session["user_id"];
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session["user_id"]};
  res.redirect(`/urls/${shortURL}`);
});


//deletes longurl key and redirects
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]["longURL"];
  res.redirect("/urls");
});


//msg from server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});