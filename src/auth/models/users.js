'use strict';

// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../../db.js');

class User {
  constructor(obj){
    this.username = obj.username,
    this.password = obj.password,
    this.email = obj.email,
<<<<<<< HEAD
    this.role = obj.role
=======
    this.role = obj.role || 'student',
>>>>>>> 9b9dbbde2628a81d133a301e67c82329507e9fbf
    this.token = 0;
  }

}
<<<<<<< HEAD


=======
>>>>>>> 9b9dbbde2628a81d133a301e67c82329507e9fbf

async function authenticateBasic(username, password) {
  const SQL = `SELECT * FROM auth WHERE username=$1;`;
  const user = await client.query(SQL, [username]);
  console.log(user.rows[0]);
  const valid = await bcrypt.compare(password, user.rows[0].password)
  if (valid) { return user.rows[0]; }
  throw new Error('Invalid User');
}

async function authenticateWithToken(token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const SQL = `SELECT * FROM auth WHERE username=$1;`;
    const user = await client.query(SQL, [parsedToken.username]);
    if (user.rows.length > 0) { return user.rows[0]; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}

function generateToken(username){
<<<<<<< HEAD
  let tokenObject = {
    username,
  }
  let token = jwt.sign(tokenObject, process.env.SECRET);
  return token;
}

module.exports = {User, authenticateBasic, authenticateWithToken, generateToken};
=======
  let token = jwt.sign({username}, process.env.SECRET);
  return token;
}

module.exports = {User, authenticateBasic, authenticateWithToken, generateToken};
>>>>>>> 9b9dbbde2628a81d133a301e67c82329507e9fbf
