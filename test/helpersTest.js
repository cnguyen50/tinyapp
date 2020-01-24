const { assert } = require('chai');
const { checkEmail } = require('../helpers');

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