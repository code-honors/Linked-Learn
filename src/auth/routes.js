'use strict';

const express = require('express');
const authRouter = express.Router();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User, generateToken } = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const client = require('../db.js');

const SECRET = process.env.SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

authRouter.use(passport.initialize())
authRouter.use(passport.session());

authRouter.get('/signup', (req, res) => {
  res.render('pages/signup');
});
authRouter.get('/signin', (req, res) => {
  res.render('pages/signin');
});
authRouter.post('/signup', signupFunction);

authRouter.post('/signin', basicAuth, signinFunction);

authRouter.get(
  '/users',
  bearerAuth,
  permissions('admin'),
  async (req, res, next) => {
    let SQL = `SELECT * FROM auth;`;
    const users = await client.query(SQL);
    const list = users.rows.map((user) => user.role);
    res.status(200).json(list);
  }
);

authRouter.get(
  '/teacher',
  bearerAuth,
  permissions('teacher'),
  async (req, res, next) => {
    res.status(200).send('Welcome to the teachers area');
  }
);

authRouter.get(
  '/student',
  bearerAuth,
  permissions('student'),
  async (req, res, next) => {
    res.status(200).send('Welcome to the students area');
  }
);

module.exports = authRouter;

async function signupFunction(req, res, next) {
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
        let { username, password, email, role, token } = user;
        const SQL2 = `INSERT INTO auth (username, password, email, role) values ($1, $2, $3, $4) RETURNING *;`;
        let values = [username, password, email, role];
        const userRecord = await client.query(SQL2, values);
        const output = {
          user: userRecord.rows[0],
          token: generateToken(userRecord.rows[0].username),
        };
        res.status(201).json(output);
      } else {
        const output = dupemail.rows[0].email;
        res.status(403).send(`email ${output} already exists, sign in instead`);
      }
    } else {
      const output = dupusername.rows[0].username;
      res
        .status(403)
        .send(`username ${output} already exists, sign in instead`);
    }
  } catch (e) {
    console.log(e);
    next(e.message);
  }
}

function signinFunction(req, res, next) {
  const user = {
    user: req.user,
    token: generateToken(req.user.username),
  };
  console.log(user);
  res.status(200).json(user);
  next();
}

////////////// GOOGLE OAUTH

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: SECRET,
      callbackURL: '/auth/googleuser',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log('1', profile);
      let user = {};
      user.body = {
        username: profile.id,
        password: '123456',
        email: profile.emails[0].value,
        role: 'student',
      };
      console.log('after', user);
      cb(null, profile.id);
    }
  )
);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/googleuser', passport.authenticate('google'), (req, res) => {
  res.send('you reached the redirect URI');
});
