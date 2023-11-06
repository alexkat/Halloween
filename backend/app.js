// Import required modules
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const storiesRoutes = require("./routes/storiesRoutes");

// Initialize the app
const app = express();

app.use(helmet());
app.use(express.json());

const connectToDatabase = require("./config/database");

// Connect to the MongoDB database
connectToDatabase();

// Route handling
app.use("/api/story", storiesRoutes);

// Error handling middleware
app.use((err, res) => {
  console.log(err);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
