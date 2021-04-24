'use strict';

const User = require('../models/users.js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization|| !req.headers.authorization === 'Bearer') { _authError() }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await User.authenticateWithToken(token);
    req.user = validUser;
    req.token = token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
}