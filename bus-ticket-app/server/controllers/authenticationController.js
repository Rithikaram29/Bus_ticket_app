const User = require('../models/userDetailModel');
const bcrypt = require('bcrypt');

const {generateToken} = require('../utils/jwtUtils');

//registration
const userRegistration = async (req, res, next) => {
    try {
        let { userName, phone, email, password, role, name } = req.body;

        
        const salt = 10;

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            userName,
            phone,
            email,
            password: hashedPassword
            , name,
            role
        })

        if (!newUser) {
            res.status(400)
            return new Error("Cannot create user")
        }
       
        res.status(201).json({user: newUser, message:"User created Successfully!"})

    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message})
    }
}

//userlogin
const userLogin = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const currentUser = await User.findOne({ userName: userName });

        if (!currentUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        const passwordCorrect = await bcrypt.compare(password, currentUser.password)

        if (!passwordCorrect) {
            res.status(400);
            return new Error("Password incorrect!");
        }

        const token = generateToken(currentUser);

        res.status(200).json(token);


        // res.status(201).json({
        //     userName: currentUser.userName,
        //     phone: currentUser.phone,
        //     email: currentUser.email,
        //     name: currentUser.name
        // })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {userRegistration,userLogin};