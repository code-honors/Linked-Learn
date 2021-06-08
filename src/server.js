'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const methodOverride = require('method-override');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


const studentRoutes = require('./routes/students.js');
const teacherRoutes = require('./routes/teachers.js');
const coursesRoutes = require('./routes/courses.js');
const allRoutes = require('./routes/all.js');
const authRoutes = require('./auth/routes.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

////////////////// chat ///////////////////////

const botName = 'Chat starts';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome !'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//////////////////////////////////////////



// //////////////////

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/home', (req, res) => {
  res.redirect('/courses');
});

app.use('/auth', authRoutes);
app.use('/all', allRoutes);
app.use('/courses', coursesRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);


app.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/chat'));
});

app.get('/video', (request, response) => {
  response.render('pages/video-call');
});

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => {
    const PORT = port || 8080;
    server.listen(PORT, () => console.log(`Server Up on ${PORT}`));
  },
};
