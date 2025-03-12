import express from "express";
import cors from "cors";
import subscriberRoutes from "./routes/subscribers.js"
import connectDB from "./db/connection.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5050;

// Connect to MongoDB
connectDB();




app.use("/subscriber", subscriberRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 5050");
});
