'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.post = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const details = requestBody.details;
  const author = requestBody.author;

  // TODO: validate body
  if (typeof title !== 'string' || typeof details !== 'string' || typeof author !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  createHack(hackInfo(title, details, author))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SUCCESS',
          hackId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Unable to process request'
        })
      })
    });
};


const createHack = hack => {
  console.log('Creating hack');
  const hackInfo = {
    TableName: process.env.HACK_TABLE,
    Item: hack,
  };
  return dynamoDb.put(hackInfo).promise()
    .then(res => hack);
};

const hackInfo = (title, details, author) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    title: title,
    details: details,
    author: author,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.HACKS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  const onGet = (err, data) => {
    if (err) {
      console.error(err);
      callback(new Error('Could not retrieve hack.'));
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data.Item),
      };
      return callback(null, response);
    }
  };
  dynamoDb.get(params, onGet)
};

module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.HACKS_TABLE,
      ProjectionExpression: "id, title"
  };

  console.log("Scanning Hacks table.");
  const onScan = (err, data) => {
      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  data: data.Items
              })
          });
      }
  };
  
  dynamoDb.scan(params, onScan);
};
