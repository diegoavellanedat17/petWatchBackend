import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a Potential User document
export interface IPotentialUser extends Document {
  name: string;
  phone: string;
  email: string;
  type: "DEVELOPER" | "USER" | "INVESTOR";
  createdAt?: Date;
}

// Create the Mongoose schema for Potential Users with timestamps
const PotentialUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["DEVELOPER", "USER", "INVESTOR"],
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Export the Mongoose model
export default mongoose.model<IPotentialUser>(
  "PotentialUser",
  PotentialUserSchema
);
