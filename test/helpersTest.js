const { assert } = require('chai');
const { generateRandomString } = require('../helpers');
const { checkEmail } = require('../helpers');
const { urlsForUser } = require('../helpers');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    },
    "userRandomID2": {
      id: "aJ48lW",
      email: "user2@example.com",
      password: "dishwasher-funk"
    }
  };

describe('checkEmail', function() {
  it('should return true valid email', function() {
    const user = checkEmail("user@example.com", users);
    const expected = "userRandomID";
    assert.deepEqual(user, expected);
  });

  it('should return undefined with an invaild email', function () {
    const user = checkEmail("user1234@example.com", user)
    const expected = undefined;
    assert.deepEqual(user, expected);
  });

});