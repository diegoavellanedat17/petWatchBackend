import mongoose, { Schema, Document } from "mongoose";

export interface ICoordinate extends Document {
  lat: number;
  lon: number;
  sendDate: string;
  petId: string;
}

const CoordinateSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  sendDate: { type: String, required: true },
  petId: { type: String, required: true },
});

export default mongoose.model<ICoordinate>("Coordinate", CoordinateSchema);
