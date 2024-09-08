const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Assuming this is used for your PostgreSQL connection
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/users', userRoutes);

// Start the server
app.listen(5001, () => {
    console.log("Server has started on port 5001");
});
