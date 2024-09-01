import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  bornDate?: Date;
  type?: string;
  breed?: string;
  imageUrl?: string;
  createdAt?: Date;
  owner_id: string;
}

const PetSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    bornDate: { type: Date },
    type: { type: String },
    breed: { type: String, required: true },
    imageUrl: { type: String },
    owner_id: { type: String, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPet>("Pet", PetSchema);
