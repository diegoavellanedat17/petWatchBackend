import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  SNSClient,
  SubscribeCommand,
  PublishCommand,
} from "@aws-sdk/client-sns";
import getDatabase from "../database";

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const snsClient = new SNSClient({ region: "us-east-1" });

const userPoolId = process.env.COGNITO_USERPOOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const snsTopicArn = process.env.SNS_TOPIC_ARN;

console.log("env variables", { clientId, snsTopicArn });

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
      { Name: "email", Value: email },
      { Name: "phone_number", Value: phoneNumber },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const data = await cognitoClient.send(command);
    const cognitoId = data.UserSub; // Cognito User ID

    const db = await getDatabase();
    const dbResponse = await db.run(
      `INSERT INTO users (cognito_id, username, email, phone) VALUES (?, ?, ?, ?)`,
      [cognitoId, username, email, phoneNumber]
    );

    console.log("the database response is ", dbResponse);

    if (snsTopicArn) {
      console.log("Subscribing phone number to SNS topic:", {
        snsTopicArn,
        phoneNumber,
      });

      const subscribeCommand = new SubscribeCommand({
        TopicArn: snsTopicArn,
        Protocol: "sms",
        Endpoint: phoneNumber,
      });
      const snsResponse = await snsClient.send(subscribeCommand);

      console.log("SNS subscribe successful:", snsResponse);

      const publishCommand = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: "Welcome to our service!",
      });
      const snsPublishResponse = await snsClient.send(publishCommand);

      console.log("SNS publish successful:", snsPublishResponse);
    }

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
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
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
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const data = await cognitoClient.send(command);
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

  const params = { AccessToken: accessToken };

  try {
    const command = new GetUserCommand(params);
    const data = await cognitoClient.send(command);
    res.status(200).json({ message: "User retrieved successfully", data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ error: "No access token" });
  }

  const params = { AccessToken: accessToken };

  try {
    const command = new GlobalSignOutCommand(params);
    await cognitoClient.send(command);
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDatabase();

    const result = await db.run(`DELETE FROM users WHERE id = ?`, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const users = await db.all(`SELECT * FROM users`);

    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByCognitoId = async (req: Request, res: Response) => {
  const { cognitoId } = req.params;

  try {
    const db = await getDatabase();

    const user = await db.get(`SELECT * FROM users WHERE cognito_id = ?`, [
      cognitoId,
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
