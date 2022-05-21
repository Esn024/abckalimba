'use strict';

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const { sendResponse } = require('./utils');

// file paths for JSON data files
const testDataFilepath = './data/testData.json';

// importing data of companies and items (products) from JSON files
const testData = require(testDataFilepath);

const checkForNewUserErrors = async (db, username, email) => {
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
  const { username, email } = req.body;

  try {
    const dbName = 'abcsynth';
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db(dbName);

    //checks
    const errMsg = await checkForNewUserErrors(db, username, email);

    if (errMsg.length === 0) {
      // insert new user into DB
      const newUser = {
        _id: uuidv4(),
        username,
        email,
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

// export the handlers
module.exports = {
  getTestData,
  getUsers,
  getUser,
  addUser,
};
