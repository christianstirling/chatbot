/**
 * Part 0: Imports
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

/**
 * Part 1: Setting up
 */

const app = express(); // create express app
app.use(cors()); // set up cors
app.use(express.json()); // parse json

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // create openai from api key

app.get("/", (_req, res) => {
  // server health check
  res.send("Server: ✅");
});

/**
 * Part 2: Chat end-point
 */

app.post("/api/chat", async (req, res) => {
  try {
    // receiving the message from frontend
    const { messages } = req.body; // array containing the whole conversation
    if (!messages || !Array.isArray(messages)) {
      // verifies that the messages are in an array
      console.error("Message: ❌");
      return res.status(400).json({ error: "messages must be an array" });
    }
    // sending the message to openai
    const completion = await openai.chat.completions.create({
      // pauses code until openai responds
      model: "gpt-4o-mini",
      messages, // sends the whole conversation to openai
      temperature: 0.7,
    });

    // receive a reply from openai
    // how the reply works: open ai returns choices,
    // we grab the first one,
    // extract the message content
    // store it as the reply
    const reply = completion.choices?.[0]?.message?.content ?? "";
    res.json({ reply }); // send the reply to the browser
  } catch (error) {
    console.error("OpenAI: ❌");
    console.error(error);
    res.status(500).json({ error: "Something went wrong talking to openai" });
  }
});

/**
 * Part 3: Creating the listening port
 */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Port ${PORT}: ✅`);
});
