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
    this.role = obj.role
    this.token = generateToken();
  }



  // capabilities(){
  //   let acl = {
  //     student: ['read'],
  //     teacher: ['read', 'create', 'update'],
  //     admin: ['read', 'create', 'update', 'delete']
  //   };
  //   return acl[this.role];
  // }

}

function generateToken(){
  let tokenObject = {
    username: this.username,
  }
  let token = jwt.sign(tokenObject, process.env.SECRET);
  return token;
}

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
    const user = client.query(SQL, [parsedToken.username]);
    if (user) { return user.rows[0]; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = {User, authenticateBasic, authenticateWithToken, generateToken};