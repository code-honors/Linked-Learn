'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const client = require('./db.js');



var GoogleStrategy = require('passport-google-oauth20').Strategy;
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes.js');
// const routes = require('./routs/raouts.js');
const passport = require('passport');

const app = express();
const SECRET = process.env.SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




/////////////////////////////////////////
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/chat', function(req, res){
    res.sendFile(path.join(__dirname, 'public/chat'));
});



let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;

  socket.on('create', function(room) {
    socket.join(room);
  });

  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', (username) => {
    if (addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

//////////////////////////////////////////

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: SECRET,
  callbackURL: "/"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
    res.send('home');
});


// app.get()

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use(authRoutes);
// app.use(routes);
app.get('/courses', getAllCourses);
app.use('*', notFoundHandler);
app.use(errorHandler);



function getAllCourses(req, res) {
  let SQL = `SELECT * FROM courses;`;
  client.query(SQL).then(result => {
    res.send(result.rows);
    // console.log(result);
  })
    .catch(e => { console.log('home error') });
}

module.exports = {
  app: app,
  start: (port) => {
    const PORT = port || 8080;
    server.listen(PORT, () => console.log(`Server Up on ${PORT}`));
  },
};


