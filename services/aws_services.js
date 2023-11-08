const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const uploadToS3 = async (data, filename) => {

    try {
        const BUCKET_NAME = process.env.BUCKET_NAME
        const IAM_USER_KEY = process.env.IAM_USER_KEY
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET

        const s3 = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        });
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read',
        };
        const uploadResponse = await s3.upload(uploadParams).promise();
        return uploadResponse.Location;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
}

module.exports = {
    uploadToS3
}