const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const cargoRoutes = require("./routes/cargoRoutes");
const UserProfile = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cargos", cargoRoutes);
app.use("/api/user", UserProfile);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port localhost:${PORT}`));
