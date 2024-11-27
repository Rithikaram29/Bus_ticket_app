import mongoose from "mongoose";
require("dotenv").config();

const mongo_uri = process.env.MONGO_URI;
const connectDB = async () => {
    try {

        mongoose.connection.on("connected", () => {
            console.log("connected to MongoDB");
        })

        mongoose.connection.on("error", (error) => {
            console.log(`error in connection:${error}`);
        })

        await mongoose.connect(mongo_uri)
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error('Failed to connect to MongoDB:', err));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


export default connectDB;