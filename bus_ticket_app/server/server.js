require("dotenv").config()

const express = require('express');
const connectDB = require('./utils/database')
const port = process.env.PORT ||1234
const app = express();
const adminRoutes = require("./routes/adminRoutes")
const userRoutes = require("./routes/clientRoute")

//connect to mongodb
// connectDB()

app.use("/admin", adminRoutes);
app.use("/user" , userRoutes);

app.listen(port,()=>{
    console.log(`listening on ${port}`)  
});







