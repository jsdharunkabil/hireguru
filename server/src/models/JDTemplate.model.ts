import mongoose, { Document, Schema } from 'mongoose';

export interface IJDTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  description: string;
  tags: string[];
  createdAt: Date;
}

const JDTemplateSchema = new Schema<IJDTemplate>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  company:     { type: String, default: '' },
  description: { type: String, required: true },
  tags:        [String],
}, { timestamps: true });

export default mongoose.model<IJDTemplate>('JDTemplate', JDTemplateSchema);