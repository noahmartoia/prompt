import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const app = express();
const port = process.env.PORT || 8034;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

console.log("process.env.GOOGLE_API_KEY", process.env.GOOGLE_API_KEY);

async function run(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const botResponse = await run(userMessage);
  res.json({ response: botResponse });
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
