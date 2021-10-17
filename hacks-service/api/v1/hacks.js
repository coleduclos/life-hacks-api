'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

function Response(statusCode, body) {
  this.statusCode = statusCode;
  this.body = body;
}

function Hack(title, details, author){
  const timestamp = new Date().getTime();
  this.id = uuid.v1()
  this.title = title
  this.details = details
  this.author = author
  this.createdAt = timestamp
  this.updatedAt = timestamp
};

// ------- CREATE ONE ---------
module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const details = requestBody.details;
  const author = requestBody.author;

  // TODO: validate body
  console.log('Validating hack...');
  if (typeof title !== 'string' || typeof details !== 'string' || typeof author !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }
  console.log('Creating hack...');
  const hack = new Hack(title, details, author)
  const onPut = (err, data) => {
    if(err) {
      console.log(err);
      callback(new Error('Could not create hack.'));
    } else {
      const response = new Response(200, data.Item);
      return callback(null, response);
    }
  }
  const hackInfo = {
    TableName: process.env.HACKS_TABLE,
    Item: hack,
  };
  dynamoDb.put(hackInfo, onPut)
};

// ------- GET ONE ---------
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
      const response = new Response(500, '');
      if ('Item' in data) {
        response.statusCode = 200
        response.body = JSON.stringify(data.Item)
      } else {
        response.statusCode = 404
        response.body = JSON.stringify({'error' : 'Not found'})
      }
      return callback(null, response);
    }
  };
  dynamoDb.get(params, onGet)
};

// ------- LIST ALL ---------
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
