import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IAnalysis extends Document {
  userId?: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobDescription: string;
  atsScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    sectionCompleteness: number;
    actionVerbs: number;
    quantifiableResults: number;
    formattingLength: number;
    total: number;
  };
  sectionsFound: {
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
  };
  detectedSkills: string[];
  jdKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  bulletSuggestions: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  interviewSuggestions: {
    question: string;
    expectedAnswer: string;
  }[];
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    jobDescription: { type: String, required: true },
    atsScore: { type: Number, required: true },
    scoreBreakdown: {
      keywordMatch: { type: Number, required: true },
      sectionCompleteness: { type: Number, required: true },
      actionVerbs: { type: Number, required: true },
      quantifiableResults: { type: Number, required: true },
      formattingLength: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    sectionsFound: {
      education: { type: Boolean, required: true },
      experience: { type: Boolean, required: true },
      projects: { type: Boolean, required: true },
      skills: { type: Boolean, required: true },
    },
    detectedSkills: [{ type: String }],
    jdKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    bulletSuggestions: [
      {
        original: { type: String, required: true },
        suggested: { type: String, required: true },
        reason: { type: String, required: true },
      },
    ],
    interviewSuggestions: [
      {
        question: { type: String, required: true },
        expectedAnswer: { type: String, required: true },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Optimize query pathways for compound historical queries: { userId: 1, createdAt: -1 }
AnalysisSchema.index({ userId: 1, createdAt: -1 });

export default models.Analysis || model<IAnalysis>("Analysis", AnalysisSchema);
