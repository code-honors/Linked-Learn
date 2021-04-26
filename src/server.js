'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const client = require('./db.js');
const methodOverride = require('method-override');
const superagent = require('superagent');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes.js');
// const routes = require('./routs/raouts.js');
const passport = require('passport');

const app = express();
const SECRET = process.env.SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const studentRoutes = require('./routes/students.js');
const teacherRoutes = require('./routes/teachers.js');
const coursesRoutes = require('./routes/courses.js');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/courses', coursesRoutes);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: SECRET,
      callbackURL: '/',
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.use('/auth', authRoutes);
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    const PORT = port || 8080;
    app.listen(PORT, () => console.log(`Server Up on ${PORT}`));
  },
};
