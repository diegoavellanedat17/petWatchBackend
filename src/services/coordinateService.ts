import Coordinate, { ICoordinate } from "../models/coordinateModel";

export const saveCoordinate = async (
  lat: number,
  lon: number,
  sendDate: string,
  petId: string
): Promise<ICoordinate> => {
  const newCoordinate = new Coordinate({
    lat,
    lon,
    sendDate,
    petId,
  });

  return await newCoordinate.save();
};

// Get all coordinates
export const getAllCoordinates = async (): Promise<ICoordinate[]> => {
  return await Coordinate.find().exec(); // Find all coordinates
};

// Get all coordinates by petId
export const getCoordinatesByPetId = async (
  petId: string
): Promise<ICoordinate[]> => {
  return await Coordinate.find({ petId }).exec(); // Find coordinates by petId
};
