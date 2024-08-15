import dotenv from "dotenv";
import { Request, Response } from "express";
import AWS from "aws-sdk";

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: "us-east-1",
});

const userPoolId = process.env.COGNITO_USERPOOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

export const register = async (req: Request, res: Response) => {
  if (!clientId) {
    throw new Error(
      "COGNITO_CLIENT_ID is not set or is empty in the environment variables."
    );
  }
  const { username, password, email, phoneNumber } = req.body;

  const params = {
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "phone_number",
        Value: phoneNumber,
      },
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();
    res.status(200).json({ message: "User registered successfully", data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmRegistration = async (req: Request, res: Response) => {
  const { username, code } = req.body;
  if (!clientId) {
    throw new Error(
      "COGNITO_CLIENT_ID is not set or is empty in the environment variables."
    );
  }

  const params = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    await cognito.confirmSignUp(params).promise();
    res.status(200).json({ message: "User confirmed successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!clientId) {
    throw new Error(
      "COGNITO_CLIENT_ID is not set or is empty in the environment variables."
    );
  }
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    res.status(200).json({ message: "Login successful", data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  const params = {
    AccessToken: accessToken,
  };

  try {
    const data = await cognito.getUser(params).promise();
    res.status(200).json({ message: "User retrieved successfully", data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ error: "No access Token" });
  }

  const params = {
    AccessToken: accessToken,
  };

  try {
    await cognito.globalSignOut(params).promise();
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
