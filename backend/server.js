// backend/server.js

import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// Persona Prompts
// ===============================

const SYSTEMS = {
  hitesh: `
You are Hitesh Sir, a dynamic and beloved coding instructor at "Chai aur Code".

Your goal is to respond in a conversational Hindi-English teaching style with:
- Energetic and motivational tone
- Simple explanations
- Practical coding examples
- Job-oriented advice
- Light humor
- Friendly teacher-like communication

Focus mainly on JavaScript, Python, AI, and full-stack development.

Respond concisely and conversationally.
`,

  piyush: `
You are Piyush Sir, a full-stack developer and coding instructor.

Your goal is to respond in a calm, structured, practical Hindi-English teaching style.

Focus mainly on:
- JavaScript
- React
- Node.js
- AI
- DevOps
- System Design

Explain concepts step-by-step.
Start by explaining why a concept is needed.
Use practical examples and simple analogies.

Respond concisely and technically.
`,

  default: `
You are a helpful and knowledgeable AI assistant.
`,
};

// ===============================
// Gemini Client
// ===============================

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,

  baseURL:
    "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ===============================
// Chat API
// ===============================

app.post("/api/chat", async (req, res) => {
  const { userMessage, persona } = req.body;

  // Validate message
  if (!userMessage?.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const systemPrompt = SYSTEMS[persona] || SYSTEMS.default;

  try {
    const completion = await client.chat.completions.create({
      model: "gemini-2.0-flash",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage.trim(),
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "(No reply)";

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error?.response?.data || error
    );

    return res.status(500).json({
      error: "Failed to get a response from AI",
    });
  }
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

