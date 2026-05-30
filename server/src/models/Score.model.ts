import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobDescription: string;
  jobTitle: string;
  overallScore: number;
  atsScore: number;
  sections: {
    experience: number;
    skills: number;
    education: number;
    formatting: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
  createdAt: Date;
}

const ScoreSchema = new Schema<IScore>({
  userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId:         { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
  jobDescription:   { type: String, required: true },
  jobTitle:         { type: String, default: '' },
  overallScore:     { type: Number, required: true },
  atsScore:         { type: Number, required: true },
  sections:         {
    experience:  { type: Number, default: 0 },
    skills:      { type: Number, default: 0 },
    education:   { type: Number, default: 0 },
    formatting:  { type: Number, default: 0 },
  },
  matchedKeywords:  [String],
  missingKeywords:  [String],
  strengths:        [String],
  improvements:     [String],
  summary:          { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model<IScore>('Score', ScoreSchema);