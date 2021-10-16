const { expect } = require('@jest/globals');
const hacks = require('../api/v1/hacks');

jest.mock("aws-sdk", () => {
    const mDocumentClient = { 
        get: jest.fn().mockImplementationOnce((_, callback) => callback(null, {'Item' : {}})),
        scan: jest.fn().mockImplementationOnce((_, callback) => callback(null, {'Items' :[]}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
  });

test('Test list hacks', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.list({},{}, lambdaCallback)
  });

test('Test get hack details', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.get(exampleEvent,{}, lambdaCallback)
  });