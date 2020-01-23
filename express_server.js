const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
// const PORT = process.envPORT || 8000;
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const generateRandomString = function() {
    let result = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = chars.length;
    for (let i = 1; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



//creates new url
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};  
  res.render("urls_new", templateVars);
});

//renders both urls and edits
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"] };
    console.log(templateVars);
  res.render("urls_show", templateVars);
});

//redirects to website
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//renders index my urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

//edits url
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


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//add cookies when login
app.post("/login", (req, res) => {
    let username = req.body.login;
    res.cookie("username", username);
    res.redirect("/urls");
});

app.post("/logout", (req, res) => {
    let username = req.cookies["username"];
    res.clearCookie("username");
    res.redirect("/urls");
})

//msg from server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

