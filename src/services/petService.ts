import Pet, { IPet } from "../models/petModel";

export const createPet = async (data: Partial<IPet>): Promise<IPet> => {
  const newPet = new Pet(data);
  return await newPet.save();
};

export const getPetsByUserId = async (ownerId: string): Promise<IPet[]> => {
  return await Pet.find({ owner_id: ownerId });
};

export const getAllPets = async (): Promise<IPet[]> => {
  return await Pet.find();
};

export const updatePet = async (
  petId: string,
  data: Partial<IPet>
): Promise<IPet | null> => {
  return await Pet.findByIdAndUpdate(petId, data, { new: true });
};

export const deletePet = async (petId: string): Promise<boolean> => {
  const result = await Pet.findByIdAndDelete(petId);
  return result !== null;
};

export const getPetById = async (petId: string): Promise<IPet | null> => {
  return await Pet.findById(petId).exec();
};
