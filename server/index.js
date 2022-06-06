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
  getPublicProjectsForList,
  getPublicProjectsByUsername,
  getPublicProjectByProjectId,
  getPrivateProject,
  addProject,
  getToneRows,
  getToneRow,
  getAllProjectsByUserId,
  test123,
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
  .get('/test123', test123)

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
  .get('/api/projects', getPublicProjectsForList)
  .get('/api/projects/:id', getPublicProjectByProjectId)
  .get('/api/private-projects/:id/:created', getPrivateProject)
  .post('/api/projects', addProject)
  .get('/api/users/:username/projects', getPublicProjectsByUsername)
  .get('/api/users/id/:id/projects', getAllProjectsByUserId)

  // tone rows
  .get('/api/tonerows', getToneRows)
  .get('/api/tonerows/:id', getToneRow)

  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
