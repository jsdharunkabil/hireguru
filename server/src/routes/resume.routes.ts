import { Router, Response } from 'express';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import pdf from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, S3_BUCKET } from '../config/s3';
import Resume from '../models/Resume.model';
import { protect, AuthRequest } from '../middleware/auth.middleware';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// Install uuid: npm i uuid @types/uuid
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/resumes/upload
router.post('/upload', protect, upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Extract text from PDF
    const pdfData = await pdf(req.file.buffer);
    const extractedText = pdfData.text;

    // Upload to S3
    const s3Key = `resumes/${req.userId}/${uuidv4()}-${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: 'application/pdf',
    }));

    const s3Url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Save to MongoDB
    const resume = await Resume.create({
      userId: req.userId,
      filename: req.file.originalname,
      s3Key,
      s3Url,
      extractedText,
    });

    res.status(201).json({ message: 'Resume uploaded', resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err });
  }
});

// GET /api/resumes — list user's resumes
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ uploadedAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err });
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) { res.status(404).json({ message: 'Resume not found' }); return; }
    await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: resume.s3Key }));
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
});

export default router;