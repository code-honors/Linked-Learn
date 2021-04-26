'use strict';

const express = require("express");
const { ExpressPeerServer } = require("peer");
const cors  = require('cors');
require('dotenv').config();
const {app, start} = require('./server.js');
app.use(cors());

app.use(express.static("public"));

app.get("/video", (request, response) => {
  response.sendFile(__dirname + "/public/video-call");
});

const listener = app.listen(4000, () => {
    console.log("Your app is listening on port ");
  });

const peerServer = ExpressPeerServer(start, {
  debug: true,
  path: '/myapp'
});

app.use('https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js', peerServer);