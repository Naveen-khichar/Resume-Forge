import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IResume extends Document {
  userId?: mongoose.Types.ObjectId;
  fileName: string;
  rawText: string;
  createdAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Resume || model<IResume>("Resume", ResumeSchema);
