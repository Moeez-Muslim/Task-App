const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');


const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);


exports.getAllTasksFromDynamoDB = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  const result = await docClient.send(new ScanCommand(params));
  return result.Items;
};


exports.saveTaskToDynamoDB = async (task) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: task
    };

    await docClient.send(new PutCommand(params));
};

exports.getTasksByUserId = async (userId) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
  };

  const result = await docClient.send(new QueryCommand(params));
  return result.Items;
};