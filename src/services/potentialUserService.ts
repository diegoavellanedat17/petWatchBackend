import PotentialUser, { IPotentialUser } from "../models/potentialUserModel";

export const savePotentialUser = async (
  name: string,
  phone: string,
  email: string,
  type: string
): Promise<IPotentialUser> => {
  const newUser = new PotentialUser({
    name,
    phone,
    email,
    type,
  });

  return await newUser.save();
};

export const getAllPotentialUsers = async (): Promise<IPotentialUser[]> => {
  return await PotentialUser.find().exec();
};
