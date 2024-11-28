import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Types } from "mongoose";

const secretkey = process.env.SECRET_KEY!;
if (!secretkey) {
  throw new Error("secret key is not set!");
}

interface CustomRequest extends Request {
  user: {
    _id: Types.ObjectId;
    email: string;
    role: string;
  };
}

//to authenticate token
const authenticateToken: RequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorised: Missing Token!" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Invalid token format" });
    return;
  }

  jwt.verify(token, secretkey, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Forbidden:Invalid Token" });
      return;
    }

    if (user) {
      req.user = user as {
        _id: Types.ObjectId;
        email: string;
        role: string;
      };
    }

    next();
  });
};

export default authenticateToken ;
