const User = require('./models/userDetailModel');
const bcrypt = require("brcypt");

//registration
const userRegistration = async (req, res, next) => {
    try {
        let { userName, phone, email, password, name } = req.body;

        const salt = 10;

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            userName,
            phone,
            email,
            password: hashedPassword
            , name
        })

        if (!newUser) {
            res.status(400)
            return new Error("Cannot create user")
        }
        res.status(201).json({
            userName: newUser.userName,
            phone: newUser.phone,
            email: newUser.email,
            name: newUser.name
        })

    } catch (error) {
        res.json({ error: error })
    }
}

//userlogin
const userLogin = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const currentUser = await User.find({ userName });

        if (!currentUser) {
            res.status(404);
            return new Error("User not found!")
        }

        const passwordCorrect = await bcrypt.compare(password, currentUser.password)

        if (passwordCorrect) {
            res.status(400);
            return new Error("Password incorrect!");
        }

        res.status(201).json({
            userName: currentUser.userName,
            phone: currentUser.phone,
            email: currentUser.email,
            name: currentUser.name
        })

    } catch (error) {
        res.json({ error: error })
    }
}

module.exports = {userRegistration,userLogin};