import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from 'express';

const secretkey = process.env.SECRET_KEY!
if (!secretkey) {
   throw new Error("secret key is not set!")
}

interface CustomRequest extends Request {
   user: {
      _id: number;
      email: string;
      role: string
   }
}

//to authenticate token
const authenticateToken: RequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => {
   const authHeader = req.header("Authorization");

   if (!authHeader) {
       res.status(401).json({ message: "Unauthorised: Missing Token!" });
       return;
   }

   const token = authHeader.split(" ")[1];

   if (!token) {
      res.status(401).json({ message: "Unauthorized: Invalid token format" });
   }

   jwt.verify(token, secretkey, (err, user) => {
      if (err) {
         return res.status(403).json({ message: "Forbidden:Invalid Token" });
      }

      if(user){
         req.user = user as {
            _id: number;
            email: string;
            role: string
         };
      }
     

      next();
   })

}

export { authenticateToken };