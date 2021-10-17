const hacks = require('../api/v1/hacks');

jest.mock("aws-sdk", () => {
    const mDocumentClient = { 
        get: jest.fn().mockImplementationOnce((_, callback) => callback(null, {})),
        put: jest.fn(),
        scan: jest.fn().mockImplementationOnce((_, callback) => callback(null, {'Items' :[]}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
  });

test('Test list hacks empty response', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.list({}, {}, lambdaCallback)
  });

test('Test list hacks non-empty response', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.list({}, {}, lambdaCallback)
  });

test('Test hack not found', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(404)
      };
    await hacks.get(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid hack', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.get(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid hack', async () => {
    const exampleEvent = {'body' : '{\"id\":\"-1\",\"title\":\"test title\",\"author\" :\"test author\",\"details\":\"test details\"}'}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await hacks.create(exampleEvent, {}, lambdaCallback)
  });