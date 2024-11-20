const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connect to database with host${connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit();
    }
   
}

module.exports= connectDB;