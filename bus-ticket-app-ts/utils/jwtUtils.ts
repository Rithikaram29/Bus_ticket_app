import * as dotenv from 'dotenv';
dotenv.config();

const secretkey : string = process.env.SECRET_KEY!;
if(!secretkey){
    throw new Error("SecretKey not set!")
}

import jwt from "jsonwebtoken";

//payload interface
interface Payload {
    id: number;
    email: string;
    role: string
}

interface User{
    _id: number;
    email: string;
    role: string

}


//generate token
const generateToken = (user: User) : string => {
    const payload : Payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, secretkey, { expiresIn: "3h" });
};


export { generateToken };
