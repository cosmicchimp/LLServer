const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables
const PORT = process.env.PORT || 4000;
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const cors = require("cors");
app.use(express.json());
app.use(cors());
const databaseInit = async () => {
  try {
    const result = await sql`SELECT * FROM images`;
    console.log(result);
  } catch (e) {
    console.log("Error: " + e);
  }
};

app.post("/get-data", (req, res) => {
  console.log(req.body);
});
databaseInit();
