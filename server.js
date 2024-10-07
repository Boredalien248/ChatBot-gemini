const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Initialize your Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint to handle chat messages
app.post("/api/chatbot", async (req, res) => {
  console.log(req.body);
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  try {
    // Call the Gemini API to get a response
    const result = await model.generateContent(message);
    const response = await result.response;

    // Send the response back to the client
    res.json({ reply: response.text() }); // Adjust based on the actual response structure
  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    res.status(500).send("Error with chatbot API");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
