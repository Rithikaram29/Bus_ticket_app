const jwt = require("jsonwebtoken");

//generate a random Secret key
const secretkey = process.env.SECRET_KEY;

//generate token
const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, secretkey, { expiresIn: "3h" });
};


module.exports = { generateToken };
