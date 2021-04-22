'use strict';

const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js')
const client = require('../db.js');

authRouter.post('/signup', signupFunction);

authRouter.post('/signin', basicAuth, signinFunction);

authRouter.get('/users', bearerAuth, permissions, async (req, res, next) => {
  let SQL = `SELECT * FROM auth;`
  const users = await client.query(SQL);
  const list = users.map((user) => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;



async function signupFunction (req, res, next) {
  try {
    let SQL = `SELECT * FROM auth WHERE username=$1;`;
    let { username, email } = req.body;
    let dupusername = await client.query(SQL, [username]);
    if (dupusername.rows.length === 0) {
      let SQL1 = `SELECT * FROM auth WHERE email=$1;`;
      let dupemail = await client.query(SQL1, [email]);
      if (dupemail.rows.length === 0) {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let userObj = req.body;
        userObj.password = hashedPassword;
        let user = await new User(userObj);
        let { username, password, email, role } = user;
        const SQL2 = `INSERT INTO auth (username, password, email, role) values ($1, $2, $3, $4) RETURNING *;`;
        let values = [username, password, email, role];
        const userRecord = await client.query(SQL2, values);
        const output = {
          user: userRecord.rows[0],
          token: user.token,
        };
        res.status(201).json(output);
      } else {
        const output = dupemail.rows[0].email;
        res.send(`email ${output} already exists, sign in instead`);
      }
    } else {
      const output = dupusername.rows[0].username;
      res.send(`username ${output} already exists, sign in instead`);
    }
  } catch (e) {
    next(e.message);
  }
}

function signinFunction(req, res, next) {
  const user = {
    user: req.user,
    token: User.generateToken(),
  };
  res.status(200).json(user);
  
}