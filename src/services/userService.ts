import User, { IUser } from "../models/userModel";

export const createUser = async (
  cognito_id: string,
  username: string,
  email: string,
  phone: string
): Promise<IUser> => {
  const newUser = new User({ cognito_id, username, email, phone });
  return await newUser.save();
};

export const getUserByCognitoId = async (
  cognitoId: string
): Promise<IUser | null> => {
  return await User.findOne({ cognito_id: cognitoId });
};

export const deleteUserById = async (id: string): Promise<boolean> => {
  const result = await User.findByIdAndDelete(id);
  return result !== null;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};
