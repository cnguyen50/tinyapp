const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
// const PORT = process.envPORT || 8000;
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = { 
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


const generateRandomString = function() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = chars.length;
  for (let i = 1; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


const checkEmail = function (email) {
for (let user in users) {
  if (users[user].email === email) {
    return users[user];
  } 
 }
 return undefined;
}; 


const checkPassword = function(password) {
  for (let user in users) {
    if (users[user].password === password) {
      return users[user];
    }
  }
  return undefined;
};



// displays cookie
app.get("/", function (req, res) {
  res.cookie("username", req.body.username);
  console.log("cookies:", req.cookies);
})


// renders Create new url
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]]};  
  res.render("urls_new", templateVars);
});


//renders tinyurl of and edit new url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]};
    console.log(templateVars);
  res.render("urls_show", templateVars);
});


//redirects to website
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//renders my urls index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]};
  res.render("urls_index", templateVars);
});

//edits url and redirects tio my
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = generateRandomString(); 
  const newURL = req.body.newURL;
  const id = req.params.shortURL;
  urlDatabase[req.params.shortURL] = newURL 
  res.redirect("/urls");
});


//creates new shorturl
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); 
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

//deletes shorturl and redirects
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


//if no error then impletements cookie with new email and redirects 
app.post("/register", (req, res) => {
  if (req.body.email === "") {
    res.status(400).send("Please enter an email");

  } else if (req.body.password === "") {
    res.status(400).send("Enter a password"); 

  } else if (checkEmail(req.body.email)) {
    res.status(400).send(`Email already exists`);
  
  } else {
    let randoUserId = generateRandomString();
    users[randoUserId] = {
      id: randoUserId, 
      email: req.body.email, 
      password: req.body.password
    };
    res.cookie("user_id", randoUserId);
    res.redirect("/urls");
  }
});


//add cookies after login and redirects to urls
app.post("/login", (req, res) => {
  if(!checkEmail(req.body.email)) {
    res.status(403).send("Please try again with correct credentials");
  } else if (!checkPassword(req.body.password)) {
    res.status(403).send("Please try again with correct password");
  } else {
    const userId = checkEmail(req.body.email)["id"];
    res.cookie("user_id", userId);
    res.redirect("/urls");
  }
});


//redirects after logout and clears cookie
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
});


//msg from server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

