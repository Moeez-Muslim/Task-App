const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME_USERS || 'Users';

exports.saveUser = async (user) => {
    await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: user
    }));
};

exports.findUserByEmail = async (email) => {
    const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { email }
    }));
    return result.Item;
};
