'use strict';

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const { sendResponse } = require('./utils');
const { networkInterfaces } = require('os');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// file paths for JSON data files
const testDataFilepath = './data/testData.json';

// importing data of companies and items (products) from JSON files
const testData = require(testDataFilepath);

const checkForUserErrors = async (db, email, username, oldUsername = null) => {
  let errMsg = '';

  // username can only include English letters, numbers, _ or -
  const usernameInvalid = !username.match(/^[a-zA-Z0-9_-]{1,30}$/);
  if (usernameInvalid) {
    errMsg += `Sorry, username can only consist of English letters, numbers, _ - symbols, and must be no longer than 30 characters. `;
  } else {
    // only do duplicate username check if this is for a new registration, or if the username is being changed
    if (username !== oldUsername) {
      const caseInsensitiveRegex = new RegExp(`^${username}$`, 'i');

      const usernameTaken = await db
        .collection('users')
        .findOne({ username: { $regex: caseInsensitiveRegex } });
      if (usernameTaken) errMsg += `Username ${username} is already taken. `;
    }
  }

  const emailValid = email.includes('@');
  if (!emailValid) errMsg += `Entered email is not valid. `;

  return errMsg;
};

// check what the highest value of a property in a particular collection is. Can use this to then increment an ID counter by one.
// TODO currently this gets the entire object, wasteful. But I couldn't get it to select only the specific field
const getHighestValue = async (db, collection, property) => {
  const object = await db
    .collection(collection)
    .find()
    .sort({ [property]: -1 })
    .limit(1)
    .toArray();

  // console.log({ highestValue });
  return object[0][property];
};

//TODO remove this test function & its endpoint
const test123 = async () => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();

  const dbName = 'abcsynth';
  const db = client.db(dbName);

  const x = await getHighestValue(db, 'projects', 'projectId');
  // console.log({ x });
};

// See if a tone row string is already in the database
const checkIfToneRowExists = async (db, toneRowStr) => {
  // console.log('checkIfToneRowExists');
  const toneRow = await db
    .collection('tonerows')
    .findOne({ toneRowStr: toneRowStr });

  // console.log({ toneRow });
  return toneRow ? true : false;
};

// check if a user has the permission to update/delete a project
// currentUser.username === project.username ||
// currentUser.username === 'Admin'
const checkIfUserHasProjectRights = async (
  db,
  currentUserId,
  usernameInProject
) => {
  // console.log('checkIfUserHasProjectRights');

  const user = await db.collection('users').findOne({ _id: currentUserId });

  // console.log({ user });
  const currentUserUsername = user.username;
  // console.log({ currentUserUsername });

  // user has rights to edit project if they are its creator, or the site admin
  return (
    currentUserUsername === usernameInProject || currentUserUsername === 'Admin'
  );
};

// See how many projects are using a specific tone row string (both public and private)
const getNumberOfProjectsUsingToneRowStr = async (db, toneRowStr) => {
  const numberOfProjectsUsingToneRow = await db
    .collection('projects')
    .countDocuments({ toneRowStr: toneRowStr });

  return numberOfProjectsUsingToneRow;
};

// removes the project ID from a tone row's projectIds array; either updates the tone row, or removes it from the database (if no other projects use it)
// returns {toneRowUpdatedResp, toneRowDeletedResp}
const removeProjectIdFromToneRow = async (db, toneRow, projectId) => {
  const toneRowStr = toneRow.toneRowStr;
  let toneRowUpdatedResp;
  let toneRowDeletedResp;

  // new array of project Ids, not including the current one
  const newToneRowProjectIds = toneRow.projectIds.filter(
    (id) => id !== projectId
  );

  // if the tone row is still used in at least one project
  if (newToneRowProjectIds.length > 0) {
    //update the toneRow data
    const updateToneRow = await db
      .collection('tonerows')
      .updateOne(
        { toneRowStr },
        { $set: { projectIds: newToneRowProjectIds } }
      );

    msg += 'Tone row info updated. ';
    if (updateToneRow) {
      toneRowUpdatedResp = {
        status: 202,
        data: null,
        message: `Project removed from the array of projects using tone row "${toneRowStr}".`,
      };
    } else {
      toneRowUpdatedResp = {
        status: 400,
        data: null,
        message: `Project could not be removed from the tone row's projects array.`,
      };
    }
  } else {
    //if there are no other projects using it, remove the toneRow from the site
    const toneRowDeleted = await db
      .collection('tonerows')
      .deleteOne({ toneRowStr });

    if (toneRowDeleted) {
      toneRowDeletedResp = {
        status: 204,
        data: toneRowStr,
        message: `Tone row "${toneRowStr}" was deleted from database.`,
      };
    } else {
      toneRowDeletedResp = {
        status: 404,
        data: toneRowStr,
        message: 'No tone row was found, so nothing was deleted...',
      };
    }
  }

  return { toneRowUpdatedResp, toneRowDeletedResp };
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

//get public info about users
const getUsers = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const usersArr = await db.collection('users').find().toArray();
    const finalUsersArr = usersArr.map((u) => {
      return { username: u.username, created: u.created, modified: u.modified };
    });

    if (usersArr) {
      const successMsg = `Found ${usersArr.length} users.`;
      sendResponse(res, 200, finalUsersArr, successMsg);
    } else {
      const errMsg = 'Oops! No users were found!';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

// get public info from any user with the username
const getUserPublicInfo = async (req, res) => {
  const username = req.params.username;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const caseInsensitiveRegex = new RegExp(`^${username}$`, 'i');

    const query = { username: caseInsensitiveRegex };
    const user = await db.collection('users').findOne(query);

    if (user) {
      // return all user info other than the private stuff - ID and email
      const userPublicInfo = { ...user };
      delete userPublicInfo._id;
      delete userPublicInfo.email;

      const successMsg = `Found user!`;
      sendResponse(res, 200, userPublicInfo, successMsg);
    } else {
      const errMsg = 'No user was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

// get ALL user info through knowing the ID (which will be saved in person's localStorage, or the admin will naturally have access to)
const getUserAllInfo = async (req, res) => {
  const id = req.params.id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { _id: id };
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
  const { username, email, projectIds, created } = req.body;

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
        ...req.body,
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
  const id = req.params.id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { _id: id };
    const user = await db.collection('users').findOne(rQuery);
    const userDeleted = await db.collection('users').deleteOne(rQuery);

    if (userDeleted) {
      const userDeletedHttpResp = {
        status: 204,
        data: user,
        message: `User deleted!`,
      };

      // delete all projects by that user
      const pQuery = { username: user.username };
      const projectsDeleted = await db
        .collection('projects')
        .deleteMany(pQuery);
      let projectsDeletedHttpResp;
      if (projectsDeleted) {
        projectsDeletedHttpResp = {
          status: 204,
          message: `All projects by username ${user.username} have been deleted.`,
        };
      }

      //TODO also remove any public projects from any tone rows that they are in

      sendResponse(
        res,
        207,
        [userDeletedHttpResp, projectsDeletedHttpResp],
        `User ${user.username} deleted, and all projects.`
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
  const id = req.params.id;
  const { username, email, projectIds, modified, about } = req.body;

  let successMsg = '';

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const rQuery = { _id: id };
    const userOriginal = await db.collection('users').findOne(rQuery);

    if (userOriginal) {
      const oldUsername = userOriginal.username;
      //tests
      const errMsg = await checkForUserErrors(db, email, username, oldUsername);

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

const getComment = async (req, res) => {
  const id = req.params.id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { _id: id };
    const comment = await db.collection('comments').findOne(query);

    if (comment) {
      const successMsg = `Found comment!`;
      sendResponse(res, 200, comment, successMsg);
    } else {
      const errMsg = 'No comment was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const addComment = async (req, res) => {
  const { comment, username, created, projectId } = req.body;

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
        ...req.body,
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
  const { comment, username, created, modified, projectId } = req.body;

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

const getCommentIdsForProject = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectId };
    const commentIdsArr = await db.collection('comments').find(query).toArray();
    const finalCommentIdsArr = commentIdsArr.map((comment) => comment._id);

    if (finalCommentIdsArr && finalCommentIdsArr.length > 0) {
      const successMsg = `Found ${finalCommentIdsArr.length} comment IDs for project ${projectId}.`;
      sendResponse(res, 200, commentIdsArr, successMsg);
    } else {
      const errMsg = `No comment IDs for project ${projectId} were found!`;
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getCommentIdsByUser = async (req, res) => {
  const username = req.params.username;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { username };
    const commentsIdsArr = await db
      .collection('comments')
      .find(query)
      .toArray();
    const finalCommentIdsArr = commentsIdsArr.map((comment) => comment._id);

    if (finalCommentIdsArr) {
      const successMsg = `Found ${finalCommentIdsArr.length} comment IDs by user ${username}.`;
      sendResponse(res, 200, finalCommentIdsArr, successMsg);
    } else {
      const errMsg = `No comment IDs by user ${username} were found!`;
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getPublicProjectsForList = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectVisibility: 'public' };
    //TODO the selectObj doesn't work
    // const select = {
    //   projectId: 1,
    //   // projectName: 1,
    //   // toneRowStr: 1,
    //   // username: 1,
    //   // created: 1,
    // };

    // get projects array, sorted by most recent being first
    const projectsArr = await db
      .collection('projects')
      .find(query)
      .sort({ created: -1 })
      .toArray();

    const finalProjectsArr = projectsArr.map(
      ({
        projectName,
        toneRowStr,
        username,
        created,
        modified = null,
        projectId,
      }) => {
        return {
          projectName,
          toneRowStr,
          username,
          created,
          modified,
          projectId,
        };
      }
    );

    if (finalProjectsArr) {
      const successMsg = `Found ${finalProjectsArr.length} projects.`;
      sendResponse(res, 200, finalProjectsArr, successMsg);
    } else {
      const errMsg = 'Oops! No projects were found!';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getPublicProjectByProjectId = async (req, res) => {
  const id = req.params.id * 1;
  // console.log({ id });
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectId: id, projectVisibility: 'public' };
    const project = await db.collection('projects').findOne(query);

    if (project) {
      // return all project info other than the _id field
      const projectPublicInfo = { ...project };
      delete projectPublicInfo._id;

      const successMsg = `Found project!`;
      sendResponse(res, 200, projectPublicInfo, successMsg);
    } else {
      const errMsg = 'No project was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

//to get data for a private project (also works for public), you need to have the projectId & the created date, plus you need to submit data showing that you have the rights for it
const getMyProject = async (req, res) => {
  const projectId = req.params.id * 1;
  // const created = req.params.created * 1;
  const { currentUserId } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectId: projectId };
    const project = await db.collection('projects').findOne(query);

    if (project) {
      // console.log('project is there');
      // console.log({ project });

      //check if the user has permission to access it
      const usernameInProject = project.username;
      // console.log({ usernameInProject });

      const userHasProjectRights = await checkIfUserHasProjectRights(
        db,
        currentUserId,
        usernameInProject
      );

      if (userHasProjectRights) {
        const successMsg = `Found project! Access granted.`;
        sendResponse(res, 200, project, successMsg);
      } else {
        const errMsg = `Project access forbidden!`;
        sendResponse(res, 403, null, errMsg);
      }
    } else {
      const errMsg = 'No project was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const addProject = async (req, res) => {
  // console.log(req.body);
  const {
    projectName,
    projectDescription,
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    created,
  } = req.body;

  try {
    const dbName = 'abcsynth';
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db(dbName);

    //check for errors
    let errMsg = '';
    if (!musicalSections) errMsg += 'The project has no musical sections. ';
    if (!toneRowStr) errMsg += 'There is no tone row. ';
    if (!orderOfSections) errMsg += 'The order of sections is empty. ';
    if (!tempo) errMsg += 'The tempo is missing. ';
    if (!key) errMsg += 'The key is missing. ';
    if (!username) errMsg += 'The username is missing. ';
    if (!beatsPerMeasure) errMsg += 'The beats per measure are missing. ';
    if (!created) errMsg += 'The create date is missing. ';
    if (
      !projectVisibility ||
      !projectVisibility.match(/^(public|private|password)$/)
    )
      errMsg += `The project visibility is not one of the accepted values (it can be "public", "private" or "password"). Instead, it is ${projectVisibility}`;

    if (errMsg.length === 0) {
      // make a new project ID, increment by 1 from previous highest project ID
      const highestProjectId = await getHighestValue(
        db,
        'projects',
        'projectId'
      );
      // console.log({ highestProjectId });
      const newProjectId = highestProjectId + 1;

      // insert new project into DB
      const newProject = {
        _id: uuidv4(),
        projectId: newProjectId,
        ...req.body,
      };
      const insertedProject = await db
        .collection('projects')
        .insertOne(newProject);

      let projectHttpResp;
      let toneRowResp;

      if (insertedProject) {
        console.log('project added');
        let msg = `Project ${newProjectId} added. `;

        projectHttpResp = {
          status: 200,
          data: newProject,
          message: `New project added from username ${username}!`,
        };

        // if project is PUBLIC, add the tone row it uses to the database of tone rows, or else add the projectId to the entry of an existing tone row

        if (projectVisibility === 'public') {
          msg += 'Project is public. ';
          // Check if the tone row already exists in the database
          const toneRowExists = await checkIfToneRowExists(db, toneRowStr);

          // console.log('after toneRowExists');
          // console.log({ toneRowExists });

          if (toneRowExists) {
            // console.log('tone row exists');
            // if it exists, add the projectID to array of projects using the tone row
            const updateToneRowWithProject = await db
              .collection('tonerows')
              .updateOne(
                { toneRowStr: toneRowStr },
                { $addToSet: { projectIds: newProjectId } }
              );

            msg += 'Tone row info updated. ';
            if (updateToneRowWithProject) {
              toneRowResp = {
                status: 202,
                data: null,
                message: `Project added to the array of projects using tone row "${toneRowStr}".`,
              };
            } else {
              toneRowResp = {
                status: 400,
                data: null,
                message: `Project could not be added to the tone row's projects array.".`,
              };
            }
          } else {
            // If it doesn't exist, add it in.
            // insert new project into DB
            // console.log('new tone row');

            // make a new tone row ID, increment by 1 from previous highest tone row ID
            const highestToneRowId = await getHighestValue(
              db,
              'tonerows',
              'toneRowId'
            );
            // console.log({ highestToneRowId });
            const newToneRowId = highestToneRowId + 1;

            const newToneRow = {
              _id: uuidv4(),
              toneRowId: newToneRowId,
              toneRowStr: toneRowStr,
              projectIds: [newProjectId],
            };

            const insertedToneRow = await db
              .collection('tonerows')
              .insertOne(newToneRow);

            msg += 'Tone row info updated. ';

            if (insertedToneRow) {
              toneRowResp = {
                status: 200,
                data: null,
                message: `New tone row with ID ${newToneRow} added: "${toneRowStr}".`,
              };
            } else {
              toneRowResp = {
                status: 400,
                data: null,
                message: `New tone row could not be added.`,
              };
            }
          }
        } else {
          msg +=
            projectVisibility === 'private'
              ? 'Project is private. '
              : 'Project is password-protected. ';
        }

        sendResponse(res, 207, [projectHttpResp, toneRowResp], msg);
      } else {
        sendResponse(
          res,
          400,
          req.body,
          'Project could not be inserted into database.'
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

const updateProject = async (req, res) => {
  const projectId = req.params.projectid * 1;
  const currentUserId = req.params.userid;

  console.log('update project server');
  console.log({ projectId });
  // console.log(req.body);
  const {
    privateProjectId, //_id
    projectName,
    projectDescription,
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    created,
    modified,
  } = req.body;

  const updatedValues = {
    _id: privateProjectId,
    projectId,
    projectName,
    projectDescription,
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    created,
    modified,
  };

  console.log({ modified });

  try {
    const dbName = 'abcsynth';
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db(dbName);

    //check for errors
    let errMsg = '';
    if (!musicalSections) errMsg += 'The project has no musical sections. ';
    if (!toneRowStr) errMsg += 'There is no tone row. ';
    if (!orderOfSections) errMsg += 'The order of sections is empty. ';
    if (!tempo) errMsg += 'The tempo is missing. ';
    if (!key) errMsg += 'The key is missing. ';
    if (!username) errMsg += 'The username is missing. ';
    if (!beatsPerMeasure) errMsg += 'The beats per measure are missing. ';
    if (!created) errMsg += 'The created date is missing. ';
    if (!modified)
      errMsg += 'The date when the project was modified is missing. ';
    if (
      !projectVisibility ||
      !projectVisibility.match(/^(public|private|password)$/)
    )
      errMsg += `The project visibility is not one of the accepted values (it can be "public", "private" or "password"). Instead, it is "${projectVisibility}"`;

    // check that current user has permission to update the project
    const userHasProjectRights = await checkIfUserHasProjectRights(
      db,
      currentUserId,
      username
    );
    if (!userHasProjectRights)
      errMsg += 'User does not have permission to update this project. ';

    if (errMsg.length === 0) {
      console.log('no err msg');

      // find the original project
      const pQuery = { projectId: projectId };
      const projectOriginal = await db.collection('projects').findOne(pQuery);

      if (projectOriginal) {
        console.log('found original');

        const newValues = { $set: { ...updatedValues } };
        const projectUpdated = await db
          .collection('projects')
          .updateOne(pQuery, newValues);

        let projectHttpResp;
        let toneRowResp;
        let oldToneRowResp;

        if (projectUpdated) {
          // console.log('project updated');
          let msg = `Project ${projectId} updated. `;

          projectHttpResp = {
            status: 202,
            data: newValues,
            message: `Project  ${projectId} from username ${username} updated!`,
          };

          // check if tone row exists. If so, check if project is in its projectIds array.
          // If it's there, and project is now private, remove it from there.
          // If length of projectIds array is 1, then delete the tone row too.
          // If it's tone row exists, projectId is NOT in its projectIds array, and project is now public, add it into the tone row's projectIds array.
          // If tone row doesn't exist, and project is now public, create the tone row & add projectId into its projectIds array.

          const tQuery = { toneRowStr: toneRowStr };
          const toneRow = await db.collection('tonerows').findOne(tQuery);

          if (toneRow) {
            // console.log('tone row exists');

            //check if project is in the tone row's projectIds array
            const toneRowHasProjectId = toneRow.projectIds.includes(projectId);

            // console.log({ toneRowHasProjectId });
            //If it's there, and project is now private, remove it from there.
            if (toneRowHasProjectId) {
              if (projectVisibility === 'private') {
                toneRowResp = removeProjectIdFromToneRow(
                  db,
                  toneRow,
                  projectId
                );
              }
            } else {
              // If tone row exists, projectId is NOT in its projectIds array, and project is now public
              if (projectVisibility === 'public') {
                //add it into the tone row's projectIds array.
                const updateToneRowWithProject = await db
                  .collection('tonerows')
                  .updateOne(
                    { toneRowStr: toneRowStr },
                    { $addToSet: { projectIds: projectId } }
                  );

                msg += 'Tone row info updated. ';
                if (updateToneRowWithProject) {
                  toneRowUpdatedResp = {
                    status: 202,
                    data: null,
                    message: `Project added to the array of projects using tone row "${toneRowStr}".`,
                  };
                } else {
                  toneRowUpdatedResp = {
                    status: 400,
                    data: null,
                    message: `Project could not be added to the tone row's projects array.`,
                  };
                }

                // and also remove projectId from the previous tone row's projectIds array
                const oldToneRowStr = projectOriginal.toneRowStr;

                const tQuery = { toneRowStr: oldToneRowStr };
                const oldtoneRow = await db
                  .collection('tonerows')
                  .findOne(tQuery);

                oldToneRowResp = removeProjectIdFromToneRow(
                  db,
                  oldtoneRow,
                  projectId
                );
              }
            }
          } else {
            // If tone row doesn't exist, and project is now public, create the tone row & add projectId into its projectIds array.

            // insert new project into DB
            // console.log('new tone row');

            // make a new tone row ID, increment by 1 from previous highest tone row ID
            const highestToneRowId = await getHighestValue(
              db,
              'tonerows',
              'toneRowId'
            );
            // console.log({ highestToneRowId });
            const newToneRowId = highestToneRowId + 1;

            const newToneRow = {
              _id: uuidv4(),
              toneRowId: newToneRowId,
              toneRowStr: toneRowStr,
              projectIds: [projectId],
            };

            const insertedToneRow = await db
              .collection('tonerows')
              .insertOne(newToneRow);

            msg += 'Tone row info updated. ';

            if (insertedToneRow) {
              toneRowResp = {
                status: 200,
                data: null,
                message: `New tone row with ID ${newToneRow} added: "${toneRowStr}".`,
              };
            } else {
              toneRowResp = {
                status: 400,
                data: null,
                message: `New tone row could not be added.`,
              };
            }
          }

          sendResponse(
            res,
            207,
            [projectHttpResp, toneRowResp, oldToneRowResp],
            msg
          );
        } else {
          sendResponse(
            res,
            400,
            null,
            `The project with ID ${projectId} was not updated.`
          );
        }
      } else {
        sendResponse(
          res,
          404,
          null,
          `No project with ID ${projectId} was found.`
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

const getToneRows = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const toneRowsArr = await db.collection('tonerows').find().toArray();

    if (toneRowsArr) {
      const successMsg = `Found ${toneRowsArr.length} tone rows.`;
      sendResponse(res, 200, toneRowsArr, successMsg);
    } else {
      const errMsg = 'Oops! No tone rows were found!';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getToneRow = async (req, res) => {
  const id = req.params.id * 1;
  // console.log({ id });
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { toneRowId: id };
    const toneRow = await db.collection('tonerows').findOne(query);

    if (toneRow) {
      const successMsg = `Found tone row!`;
      sendResponse(res, 200, toneRow, successMsg);
    } else {
      const errMsg = 'No tone row was found...';
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getPublicProjectsByUsername = async (req, res) => {
  const username = req.params.username;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query = { projectVisibility: 'public', username };
    //TODO the selectObj doesn't work
    // const select = {
    //   projectId: 1,
    //   // projectName: 1,
    //   // toneRowStr: 1,
    //   // username: 1,
    //   // created: 1,
    // };
    const projectsArr = await db.collection('projects').find(query).toArray();

    const finalProjectsArr = projectsArr.map(
      ({ projectName, toneRowStr, created, modified = null, projectId }) => {
        return {
          projectName,
          toneRowStr,
          username,
          created,
          modified,
          projectId,
        };
      }
    );

    if (finalProjectsArr) {
      const successMsg = `Found ${finalProjectsArr.length} public projects by ${username}.`;
      sendResponse(res, 200, finalProjectsArr, successMsg);
    } else {
      const errMsg = `Oops! No projects by ${username} were found!`;
      sendResponse(res, 404, null, errMsg);
    }
    client.close();
  } catch (err) {
    sendResponse(res, 500, req.body, err.message);
  }
};

const getAllProjectsByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db('abcsynth');

    const query1 = { _id: userId };
    const user = await db.collection('users').findOne(query1);

    // console.log(user.username);

    const username = user.username;

    const query2 = { username };
    const projectsArr = await db.collection('projects').find(query2).toArray();
    const finalProjectsArr = projectsArr.map(
      ({
        projectId,
        projectName,
        toneRowStr,
        created,
        modified = null,
        projectVisibility,
      }) => {
        return {
          projectId,
          projectName,
          toneRowStr,
          created,
          modified,
          projectVisibility,
        };
      }
    );

    if (finalProjectsArr && finalProjectsArr.length > 0) {
      const successMsg = `Found ${finalProjectsArr.length} projects by user ${username}.`;
      sendResponse(res, 200, finalProjectsArr, successMsg);
    } else {
      const errMsg = `No projects by user ${username} were found!`;
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
  getUserPublicInfo,
  getUserAllInfo,
  addUser,
  deleteUser,
  updateUser,
  getComment,
  addComment,
  updateComment,
  deleteComment,
  getCommentIdsForProject,
  getCommentIdsByUser,
  getPublicProjectsForList,
  getPublicProjectByProjectId,
  addProject,
  updateProject,
  getToneRows,
  getToneRow,
  getPublicProjectsByUsername,
  getAllProjectsByUserId,
  test123,
  getMyProject,
};
