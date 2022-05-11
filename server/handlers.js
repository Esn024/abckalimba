'use strict';

const fs = require('fs');
const { sendResponse } = require('./utils');

// file paths for JSON data files
const testDataFilepath = './data/testData.json';

// importing data of companies and items (products) from JSON files
const testData = require(testDataFilepath);

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

// export the handlers
module.exports = {
  getTestData,
};
