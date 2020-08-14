const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '../.env' });

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

require('./routes.js')(app, io);

server.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
