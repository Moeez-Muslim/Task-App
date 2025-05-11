const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Init AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads file to S3 and returns a presigned GET URL
 * @param {Object} file - Multer file object
 * @param {string} taskId - Unique task ID
 * @returns {string} - Presigned URL to access the file
 */
exports.uploadFileToS3 = async (file, taskId) => {
  const fileStream = fs.createReadStream(file.path);
  const key = `${taskId}_${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  try {
    // Upload file
    await s3.send(new PutObjectCommand(uploadParams));

    // Generate presigned URL for GET
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    return key;
  } catch (err) {
    console.error('❌ Failed to upload or sign URL:', err);
    throw err;
  }
};
