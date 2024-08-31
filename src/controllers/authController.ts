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
import {
  createUser,
  getUserByCognitoId,
  deleteUserById,
  getAllUsers,
} from "../services/userService";

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const snsClient = new SNSClient({ region: "us-east-1" });

const userPoolId = process.env.COGNITO_USERPOOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const snsTopicArn = process.env.SNS_TOPIC_ARN;

export const register = async (req: Request, res: Response) => {
  if (!clientId) {
    throw new Error(
      "COGNITO_CLIENT_ID is not set or is empty in the environment variables."
    );
  }
  const { username, password, email, phoneNumber } = req.body;

  const params = {
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "phone_number", Value: phoneNumber },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const data = await cognitoClient.send(command);
    const cognitoId = data.UserSub;

    const newUser = await createUser(cognitoId!, username, email, phoneNumber);

    if (snsTopicArn) {
      const subscribeCommand = new SubscribeCommand({
        TopicArn: snsTopicArn,
        Protocol: "sms",
        Endpoint: phoneNumber,
      });
      await snsClient.send(subscribeCommand);

      const publishCommand = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: "Welcome to our service!",
      });
      await snsClient.send(publishCommand);
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
    const cognitoId = data.Username;

    if (!cognitoId) {
      return res.status(400).json({ error: "No userId" });
    }

    const userData = await getUserByCognitoId(cognitoId!);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User retrieved successfully", data: userData });
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

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const success = await deleteUserById(id);
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByCognitoIdController = async (
  req: Request,
  res: Response
) => {
  const { cognitoId } = req.params;

  try {
    const user = await getUserByCognitoId(cognitoId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
