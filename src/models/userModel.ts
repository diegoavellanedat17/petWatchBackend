import getDatabase from "../database";

export const getUserById = async (cognitoId: string) => {
  const db = await getDatabase();

  const user = await db.get(`SELECT * FROM users WHERE cognito_id = ?`, [
    cognitoId,
  ]);

  if (!user) {
    console.log("User not found");
    return;
  }

  return user;
};
