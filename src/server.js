'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const client = require('./db.js');



const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
    app.listen(PORT, () => console.log(`Server Up on ${PORT}`));
  },
};


