require("dotenv").config()

const express = require('express');
const connectDB = require('./utils/database')
const port = process.env.PORT || 4000
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/clientRoute");
const authRoutes = require("./loginRegistration/routes/userloginRoutes")
const {authenticateToken} = require("./middlewares/authentication");


//connect to mongodb
connectDB();
app.use(express.json())



app.use("/admin",authenticateToken, adminRoutes);
app.use("/user",authenticateToken, userRoutes);
app.use("/auth",authRoutes)

app.listen(port,()=>{
    console.log(`listening on ${port}`)  
});







