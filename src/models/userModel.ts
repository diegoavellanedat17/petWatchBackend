import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  cognito_id: string;
  username: string;
  email: string;
  phone: string;
}

const UserSchema: Schema = new Schema({
  cognito_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
