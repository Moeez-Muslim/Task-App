require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const createUsersTable = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME_USERS || 'Users',
    AttributeDefinitions: [
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'email', KeyType: 'HASH' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('✅ Users table created');
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('ℹ️ Users table already exists');
    } else {
      console.error('❌ Error creating Users table:', err);
    }
  }
};

const createTasksTable = async () => {
  const params = {
    "TableName": "Tasks",
    "KeySchema": [
        { "AttributeName": "userId", "KeyType": "HASH" },
        { "AttributeName": "id", "KeyType": "RANGE" }
    ],
    "AttributeDefinitions": [
        { "AttributeName": "userId", "AttributeType": "S" },
        { "AttributeName": "id", "AttributeType": "S" }
    ],
    "BillingMode": "PAY_PER_REQUEST"
    }


  try {
    await client.send(new CreateTableCommand(params));
    console.log('✅ Tasks table created');
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('ℹ️ Tasks table already exists');
    } else {
      console.error('❌ Error creating Tasks table:', err);
    }
  }
};

const main = async () => {
  await createUsersTable();
  await createTasksTable();
};

main();
