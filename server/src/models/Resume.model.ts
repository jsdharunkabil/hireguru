import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  s3Key: string;
  s3Url: string;
  extractedText: string;
  uploadedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename:      { type: String, required: true },
  s3Key:         { type: String, required: true },
  s3Url:         { type: String, required: true },
  extractedText: { type: String, default: '' },
  uploadedAt:    { type: Date, default: Date.now },
});

export default mongoose.model<IResume>('Resume', ResumeSchema);