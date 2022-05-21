'use strict';

const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

const {
  getTestData,
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getCommentsForProject,
  addComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
} = require('./handlers');

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

  // users
  .get('/api/users', getUsers)
  .get('/api/users/:username', getUser)
  .post('/api/users', addUser)
  .put('/api/users/:username', updateUser)
  .delete('/api/users/:username', deleteUser)

  // comments
  .post('/api/comments', addComment)
  .put('/api/comments/:id', updateComment)
  .delete('/api/comments/:id', deleteComment)
  .get('/api/projects/:projectId/comments', getCommentsForProject)
  .get('/api/users/:username/comments', getCommentsByUser)

  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
