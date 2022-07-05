'use strict';

const path = require('path');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

const {
  getTestData,
  getUsers,
  getUserPublicInfo,
  getUserAllInfo,
  signInUser,
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
  getMyProject,
  addProject,
  updateProject,
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
  // .use('/', express.static(__dirname + '/'))

  // serves all our static files from the build directory
  .use(express.static(path.join(__dirname, 'build')))

  // Have Node serve the files for our built React app
  // .use(express.static(path.resolve(__dirname, '../client/build')))

  // REST endpoints
  .get('/test', getTestData)
  .get('/test123', test123)

  // users
  .get('/api/users', getUsers)
  .get('/api/users/:username', getUserPublicInfo)
  .put('/api/users/signin/:username', signInUser)
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
  .post('/api/myprojects/:id', getMyProject)
  .post('/api/projects', addProject)
  .put('/api/projects/update/:projectid/:userid', updateProject)
  .get('/api/users/:username/projects', getPublicProjectsByUsername)
  .get('/api/users/id/:id/projects', getAllProjectsByUserId)

  // tone rows
  .get('/api/tonerows', getToneRows)
  .get('/api/tonerows/:id', getToneRow)

  // All other GET requests not handled before will return our React app
  .get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })

  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
