'use strict';

const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

const {
  getTestData,
  getUsers,
  getUserPublicInfo,
  getUserAllInfo,
  addUser,
  updateUser,
  deleteUser,
  getCommentIdsForProject,
  getComment,
  addComment,
  updateComment,
  deleteComment,
  getCommentIdsByUser,
  getProject,
  addProject,
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
  .get('/api/users/:username', getUserPublicInfo)
  .get('/api/users/id/:id', getUserAllInfo)
  .post('/api/users', addUser)
  .put('/api/users/id/:id', updateUser)
  .delete('/api/users/id/:id', deleteUser)

  // comments
  .get('/api/comments/:id', getComment)
  .post('/api/comments', addComment)
  .put('/api/comments/:id', updateComment)
  .delete('/api/comments/:id', deleteComment)
  .get('/api/projects/:projectId/comments', getCommentIdsForProject)
  .get('/api/users/:username/comments', getCommentIdsByUser)

  //projects
  .get('/api/projects/:id', getProject)
  .post('/api/projects', addProject)

  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
