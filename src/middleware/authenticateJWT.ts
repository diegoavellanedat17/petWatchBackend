import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import jwkToPem from "jwk-to-pem";
import dotenv from "dotenv";

dotenv.config();

const cognitoPoolId = process.env.COGNITO_USERPOOL_ID;
if (!cognitoPoolId) {
  throw new Error("COGNITO_USERPOOL_ID is not set in environment variables");
}

const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;

const getPublicKeys = async () => {
  const url = `${cognitoIssuer}/.well-known/jwks.json`;
  const publicKeys = await axios.get(url);
  const keys = publicKeys.data.keys.reduce((acc: any, key: any) => {
    acc[key.kid] = jwkToPem(key);
    return acc;
  }, {});
  return keys;
};

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const publicKeys = await getPublicKeys();
    const decodedToken: any = jwt.decode(token, { complete: true });

    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const pem = publicKeys[decodedToken.header.kid];
    if (!pem) {
      return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = {
        id: decoded.sub,
        ...decoded,
      };
      next();
    });
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(500).json({ message: "Could not verify token" });
  }
};

export default authenticateJWT;
