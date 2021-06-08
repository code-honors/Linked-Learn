'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const methodOverride = require('method-override');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors : {
      origin : 'http://localhost:3000',
      methoud:['POST','GET']
  }
})



const studentRoutes = require('./routes/students.js');
const teacherRoutes = require('./routes/teachers.js');
const coursesRoutes = require('./routes/courses.js');
const allRoutes = require('./routes/all.js');
const authRoutes = require('./auth/routes.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const formatMessage = require('./utils/messages');


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
const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);


// Run when client connects
io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });



  // Listen for chatMessage
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
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
