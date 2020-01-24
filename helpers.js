const generateRandomString = function() {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = chars.length;
    for (let i = 1; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
  return result;
};


const checkEmail = function(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
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

module.exports = { 
checkEmail, urlsForUser, generateRandomString };