const fs = require('fs');
const path = require('path');
const { uploadFileToS3 } = require('../services/s3Service');
const { saveTaskToDynamoDB } = require('../services/dynamoService');
const { v4: uuidv4 } = require('uuid');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getAllTasksFromDynamoDB } = require('../services/dynamoService'); // Assume you add this
const { getTasksByUserId } = require('../services/dynamoService');




const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadTask = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  try {
    const taskId = uuidv4();
    let fileKey = null;

    if (file) {
      // ✅ Upload to S3 first
      fileKey = await uploadFileToS3(file, taskId);

      // ✅ Then delete local temp file
      fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
    }

    const task = {
      id: taskId,
      title,
      description,
      fileKey,
      userId: req.userId,
    };

    await saveTaskToDynamoDB(task);

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('❌ Upload Task Error:', error);
    res.status(500).json({ error: 'Failed to upload task' });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const tasks = await getTasksByUserId(req.userId);

    const tasksWithUrls = await Promise.all(tasks.map(async (task) => {
      if (task.fileKey) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: task.fileKey,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 mins
        return { ...task, fileUrl: url };
      }
      return task;
    }));

    res.status(200).json(tasksWithUrls);
  } catch (error) {
    console.error('Failed to get tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
