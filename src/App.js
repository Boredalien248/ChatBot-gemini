import React, { useState } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    
    // Update messages state with the user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botMessage = await fetchBotResponse(input); // function to get bot's reply

    // Update messages state with the bot's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: botMessage },
    ]);
    
    setInput("");
  };

  const fetchBotResponse = async (message) => {
    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
  
      console.log("Response status:", response.status); // Log the response status
      const responseBody = await response.text(); // Read response body as text first
      console.log("Response body:", responseBody); // Log the response body for debugging
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = JSON.parse(responseBody); // Parse the response body as JSON
      return data.reply; // Assuming the API returns a "reply" field
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I couldn't get a response."; // Default error message
    }
  };
  

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default App;
