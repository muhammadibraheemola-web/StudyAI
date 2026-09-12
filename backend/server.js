const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const { Groq } = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb" }));

// =====================================
// Groq Setup
// =====================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================
// File Upload Setup
// =====================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

// =====================================
// Home
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyAI Backend Running 🚀",
  });
});

// =====================================
// Health Check
// =====================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "StudyAI Backend",
  });
});

// =====================================
// Chat + Notes
// =====================================

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content:
            "You are StudyAI, a friendly AI tutor. Explain everything clearly in simple English suitable for secondary school students. Use markdown when appropriate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 2048,
    });

    res.json({
      success: true,
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Chat error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "AI request failed.",
    });
  }
});

// =====================================
// Quiz Generator
// =====================================

app.post("/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic is required.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
Generate exactly 5 multiple choice questions.

Return ONLY valid JSON.

Example:

[
  {
    "question":"What is 2 + 2?",
    "options":["1","2","3","4"],
    "answer":3,
    "explanation":"2 + 2 equals 4."
  }
]

Rules:
- Exactly 5 questions.
- Exactly 4 options each.
- answer must be the option index (0-3).
- No markdown.
- No code fences.
- No extra text.
`,
        },

        {
          role: "user",
          content: `Create a quiz about ${topic}.`,
        },
      ],

      temperature: 0.6,
      max_tokens: 2048,
    });

    let text = completion.choices[0].message.content.trim();

    text = text.replace(/```json/gi, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const quiz = JSON.parse(text);

    res.json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.error("Quiz error:", err);

    res.status(500).json({
      success: false,
      error: "Unable to generate quiz.",
    });
  }
});

// =====================================
// Homework Scanner
// =====================================

app.post("/homework", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No homework image was uploaded.",
      });
    }

    console.log("📷 Homework image received");
    console.log("📦 File size:", req.file.size);
    console.log("📝 File type:", req.file.mimetype);

    // =====================================
    // Convert image to Base64
    // =====================================

    const base64Image = req.file.buffer.toString("base64");

    // =====================================
    // Build image data URL
    // =====================================

    const imageDataUrl =
      `data:${req.file.mimetype};base64,${base64Image}`;

    // =====================================
    // Ask vision model to understand homework
    // =====================================

    const completion = await groq.chat.completions.create({
      // Updated vision model
      model: "qwen/qwen3.8-27b",

      messages: [
        {
          role: "system",
          content: `
You are StudyAI Homework Scanner.

You are a friendly AI tutor for secondary school students.

Look carefully at the homework image.

Identify the questions that are visible.

For each question:

1. Write the question.
2. Give the answer.
3. Explain the solution step by step in simple English.

If it is mathematics, show the working clearly.

If part of the image is unclear, say that the question is unclear instead of inventing information.

Use markdown.

Do not simply give answers.
Teach the student how to solve the problem.

Be accurate and pay close attention to mathematical symbols, numbers, equations, and diagrams.
`,
        },

        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Analyze this homework image and help me understand and solve the questions.",
            },

            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ],

      temperature: 0.3,
      max_completion_tokens: 4096,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("Homework scanner error:", err);

    res.status(500).json({
      success: false,
      error:
        err.message ||
        "Unable to analyze the homework image.",
    });
  }
});

// =====================================
// Start Server
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("=================================");
  console.log("🚀 StudyAI Backend Started");
  console.log(`🌍 Port: ${PORT}`);
  console.log("🤖 Groq AI Connected");
  console.log("🧠 Quiz Generator Ready");
  console.log("📝 Notes Generator Ready");
  console.log("💬 AI Chat Ready");
  console.log("🃏 Flashcards Ready");
  console.log("📷 Homework Scanner Ready");
  console.log("=================================");
});