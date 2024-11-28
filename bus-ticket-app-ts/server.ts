import dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import connectDB from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/clientRoute";
import authRoutes from "./routes/userAuthRoutes";
import  authorisation from "./middlewares/authentication";

const port: number = parseInt(process.env.PORT || "4000", 10);
if (isNaN(port)) {
  throw new Error("Invalid PORT environment variable.");
}

const app: Application = express();

//connect to mongodb
connectDB();
app.use(express.json());

app.use("/admin", authorisation, adminRoutes);
app.use("/user", authorisation, userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
