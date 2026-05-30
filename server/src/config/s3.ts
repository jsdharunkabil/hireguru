import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

console.log('S3 Bucket:', process.env.AWS_S3_BUCKET); // debug line

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || 'hireguru-resumes';