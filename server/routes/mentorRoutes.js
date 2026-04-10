import { Router } from "express";
import { classifyIntent, generateMentorReply, generateCareerAnalysis } from "../controllers/aiController.js";

const router = Router();

router.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ type: "text", reply: "Please send a message." });
  }

  try {
    // Sanitize history — only keep string content messages
    const cleanHistory = (history || [])
      .filter((m) => m && typeof m.content === "string")
      .slice(-8);

    const intent = await classifyIntent(message);
    console.log("Intent classified as:", intent, "for message:", message.slice(0, 60));

    if (intent === "career_analysis") {
      const careers = await generateCareerAnalysis({
        skills: message,
        interests: message,
        goals: "",
      });
      return res.json({ type: "careers", reply: careers });
    }

    const reply = await generateMentorReply(message, cleanHistory);
    return res.json({ type: "text", reply });

  } catch (err) {
    console.error("Mentor route error:", err.message);
    return res.status(500).json({
      type: "text",
      reply: "I'm having a moment — could you try again?",
    });
  }
});

export default router;