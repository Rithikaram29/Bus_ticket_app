const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRole = Object.freeze({
    ADMIN: "admin",
    CUSTOMER: "customer"
});

const userDetails = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.CUSTOMER
    },

    name: String,
});

const User = mongoose.model("User", userDetails);

module.exports = { User, UserRole };