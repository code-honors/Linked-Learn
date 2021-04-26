'use strict';


require('dotenv').config();
const { app } = require('./src/server.js');
const client = require('./src/db.js');

// Start up DB Server
// const mongoose = require('mongoose');
// const options = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// };
// mongoose.connect(process.env.MONGODB_URI, options)
// .then(() => {
//   require('./src/server.js').start(process.env.PORT);
// })
// .catch((e) => {
//       console.log('__CONNECTION ERROR__', e.message);
//     });
// Start the web server

const server = require('./src/server.js');

client.connect()
  .then(() => {
    server.start(process.env.PORT);
  })
  .catch(e => { console.log('connection error', e) });

