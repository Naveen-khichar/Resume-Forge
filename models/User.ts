import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  image: { type: String },
  emailVerified: { type: Date },
});

export default models.User || model<IUser>("User", UserSchema);
