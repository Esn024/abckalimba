'use strict';

const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

const { getTestData, getUsers, getUser, addUser } = require('./handlers');

express()
  .use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // REST endpoints
  .get('/test', getTestData)
  .get('/api/users', getUsers)
  .get('/api/users/:username', getUser)
  .post('/api/users', addUser)

  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
