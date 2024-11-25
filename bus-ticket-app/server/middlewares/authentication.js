const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// const {secretkey} = require("../utils/jwtUtils")

//generate a random Secret key
// const secretkey = crypto.randomBytes(32).toString('hex');
const secretkey =process.env.SECRET_KEY


//to authenticate token
const authenticateToken = (req,res,next)=>{
 const authHeader = req.header("Authorization");

 if(!authHeader){
    return res.Status(401).json({message: "Unauthorised: Missing Token!"})
 }

 const token = authHeader.split(" ")[1];

 if(!token){
    res.status(401).json({message:"Unauthorized: Invalid token format"})
 }

 jwt.verify(token,secretkey,(err,user)=>{
    if(err){
        return res.status(403).json({message:"Forbidden:Invalid Token"})
    }

    req.user = user;
    next();
 })

}
module.exports = {authenticateToken}