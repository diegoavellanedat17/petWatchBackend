import { Request, Response, NextFunction } from "express";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const validUsername = process.env.BASIC_AUTH_USERNAME || "admin";
  const validPassword = process.env.BASIC_AUTH_PASSWORD || "password";

  if (username === validUsername && password === validPassword) {
    return next();
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export default basicAuth;
