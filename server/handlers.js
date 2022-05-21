'use strict';

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const { sendResponse } = require('./utils');

// file paths for JSON data files
const testDataFilepath = './data/testData.json';

// importing data of companies and items (products) from JSON files
const testData = require(testDataFilepath);

const checkForUserErrors = async (db, email, username) => {
  let errMsg = '';

  const usernameInvalid = !username.matches(/^[a-zA-Z0-9_-]{1,30}$/);
  if (usernameInvalid) {
    errMsg += `Sorry, username can only consist of English letters, numbers, _ - symbols, and must be no longer than 30 characters. `;
  } else {
    const usernameTaken = await db
      .collection('users')
      .findOne({ username: username });
    if (usernameTaken) errMsg += `Username ${username} is already taken. `;
  }

  const emailValid = email.includes('@');
  if (!emailValid) errMsg += `Entered email is not valid. `;

  return errMsg;
};

// get all the items from data/testData.json
const getTestData = (req, res) => {
  try {
    // if there is data in the testData file
    if (testData) {
      // server sends positive response with success message
      const successMsg = `Displaying all testData items`;
      sendResponse(res, 200, testData, successMsg);
    } else {
      // server sends negative response  with error message
      const errMsg = 'Oops! No testData items were found!';
      sendResponse(res, 404, null, errMsg);
    }
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const usersArr = await db.collection('users').find().toArray();

    if (usersArr) {
      const successMsg = `Found users`;
      sendResponse(res, 200, usersArr, successMsg);
    } else {
      const errMsg = 'Oops! No users were found!';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getUser = async (req, res) => {
  const username = req.params.username;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { username };
    const user = await db.collection('users').findOne(query);

    if (user) {
      const successMsg = `Found user!`;
      sendResponse(res, 200, user, successMsg);
    } else {
      const errMsg = 'No user was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const addUser = async (req, res) => {
  const { username, email, projects } = req.body;

  try {
    const dbName = 'abcsynth';
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db(dbName);

    //checks
    const errMsg = await checkForUserErrors(db, email, username);

    if (errMsg.length === 0) {
      // insert new user into DB
      const newUser = {
        _id: uuidv4(),
        username,
        email,
        projects,
      };
      const insertedUser = await db.collection('users').insertOne(newUser);

      if (insertedUser) {
        sendResponse(
          res,
          200,
          newUser,
          `New user created with username ${username}!`
        );
      } else {
        sendResponse(
          res,
          400,
          req.body,
          'User could not be inserted into database.'
        );
      }
    } else {
      sendResponse(res, 400, req.body, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const deleteUser = async (req, res) => {
  const username = req.params.username;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { username };
    const user = await db.collection('users').findOne(rQuery);
    const userDeleted = await db.collection('users').deleteOne(rQuery);

    if (userDeleted) {
      const userDeletedHttpResp = {
        status: 204,
        data: user,
        message: `User deleted!`,
      };

      // delete all projects by that user
      const projectsDeleted = await db
        .collection('projects')
        .deleteMany(rQuery);
      let projectsDeletedHttpResp;
      if (projectsDeleted) {
        projectsDeletedHttpResp = {
          status: 204,
          message: `All projects by username ${username} have been deleted.`,
        };
      }

      sendResponse(
        res,
        207,
        [userDeletedHttpResp, projectsDeletedHttpResp],
        `User ${username} deleted, and all projects.`
      );
    } else {
      const errMsg = 'No user was found, so nothing was deleted...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const updateUser = async (req, res) => {
  const username = req.params.username;
  const { email, projects } = req.body;

  let successMsg = '';

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { username };
    const userOriginal = await db.collection('users').findOne(rQuery);

    if (userOriginal) {
      //tests
      const errMsg = await checkForUserErrors(db, email, username);

      if (errMsg.length === 0) {
        const newValues = { $set: { _id: userOriginal._id, ...req.body } };
        const userUpdated = await db
          .collection('users')
          .updateOne(rQuery, newValues);

        if (userUpdated) {
          successMsg = `User ${username} updated!`;
          sendResponse(
            res,
            202,
            { _id: userOriginal._id, ...req.body },
            successMsg
          );
        } else {
          sendResponse(
            res,
            400,
            newValues,
            `User ${username} could not be updated.`
          );
        }
      } else {
        sendResponse(res, 400, req.body, errMsg);
      }
    } else {
      sendResponse(res, 404, username, 'No user with that username was found');
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const addComment = async (req, res) => {
  const { comment, username, createDate, projectId } = req.body;

  try {
    const dbName = 'abcsynth';
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db(dbName);

    //check for errors
    const errMsg = comment.length === 0 ? 'The comment is empty' : '';

    if (errMsg.length === 0) {
      // insert new comment into DB
      const newComment = {
        _id: uuidv4(),
        comment,
        username,
        projectId,
        createDate,
      };
      const insertedComment = await db
        .collection('comments')
        .insertOne(newComment);

      if (insertedComment) {
        sendResponse(
          res,
          200,
          newComment,
          `New comment added from username ${username} to project ${projectId}!`
        );
      } else {
        sendResponse(
          res,
          400,
          req.body,
          'Comment could not be inserted into database.'
        );
      }
    } else {
      sendResponse(res, 400, req.body, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const updateComment = async (req, res) => {
  const id = req.params.id;
  const { comment, username, createDate, projectId } = req.body;

  let successMsg = '';

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { _id: id };
    const commentOriginal = await db.collection('comments').findOne(rQuery);

    if (commentOriginal) {
      //tests
      const errMsg = comment.length === 0 ? 'The comment is empty' : '';

      if (errMsg.length === 0) {
        const newValues = { $set: { _id: id, ...req.body } };
        const commentUpdated = await db
          .collection('comments')
          .updateOne(rQuery, newValues);

        if (commentUpdated) {
          successMsg = `Comment ${id} by user ${username} updated!`;
          sendResponse(res, 202, { _id: id, ...req.body }, successMsg);
        } else {
          sendResponse(
            res,
            400,
            newValues,
            `Comment ${id} by user ${username} could not be updated.`
          );
        }
      } else {
        sendResponse(res, 400, req.body, errMsg);
      }
    } else {
      sendResponse(res, 404, username, 'No comment with that ID was found');
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const deleteComment = async (req, res) => {
  const id = req.params.id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { _id: id };
    const comment = await db.collection('comments').findOne(rQuery);
    const commentDeleted = await db.collection('comments').deleteOne(rQuery);

    if (commentDeleted) {
      sendResponse(
        res,
        204,
        comment,
        `Comment ${id} by user ${username} deleted.`
      );
    } else {
      const errMsg = 'No comment was found, so nothing was deleted...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getCommentsForProject = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectId };
    const commentsArr = await db.collection('comments').find(query).toArray();

    if (commentsArr) {
      const successMsg = `Found comments for project ${projectId}`;
      sendResponse(res, 200, commentsArr, successMsg);
    } else {
      const errMsg = `No comments for project ${projectId} were found!`;
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getCommentsByUser = async (req, res) => {
  const username = req.params.username;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { username };
    const commentsArr = await db.collection('comments').find(query).toArray();

    if (commentsArr) {
      const successMsg = `Found comments by user ${username}`;
      sendResponse(res, 200, commentsArr, successMsg);
    } else {
      const errMsg = `No comments by user ${username} were found!`;
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

// export the handlers
module.exports = {
  getTestData,
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  addComment,
  updateComment,
  deleteComment,
  getCommentsForProject,
  getCommentsByUser,
};
