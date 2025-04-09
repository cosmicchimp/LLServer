const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables
const PORT = process.env.PORT || 4000;
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const cors = require("cors");

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS

// Initialize database connection and check for images table
const databaseInit = async () => {
  try {
    const result = await sql`SELECT * FROM images`;
    console.log(result); // Logs the result of the query (for debugging)
  } catch (e) {
    console.error("Error with database initialization: " + e);
  }
};

// Endpoint to handle POST data from the Python scraper
app.post("/get-data", async (req, res) => {
  const data = req.body; // Get the JSON data sent from Python scraper

  console.log("Received data:", data); // Log received data

  try {
    // Insert received data into the database (optional)
    for (const item of data) {
      await sql`
        INSERT INTO images (imageLink, alt, link)
        VALUES (${item.image_url}, ${item.alt_text}, ${item.link})
      `;
    }

    // Send success response
    res.status(200).json({
      message: "Data received and stored successfully!",
      receivedData: data, // Optionally, include the received data in the response
    });
  } catch (e) {
    console.error("Error processing data:", e);
    res.status(500).json({
      message: "Error processing the data",
      error: e.message,
    });
  }
});

// Initialize the database once when the server starts
databaseInit();
app.get("/", (req, res) => {
  res.send("Server is running");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
