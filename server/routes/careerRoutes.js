import { Router } from "express";
import { generateCareerAnalysis } from "../controllers/aiController.js";

const router = Router();

// POST /career/analyze
router.post("/analyze", async (req, res) => {
  const { skills, interests, goals } = req.body;

  if (!skills?.trim() && !interests?.trim()) {
    return res.status(400).json({
      message: "Please provide at least your skills or interests to analyze.",
    });
  }

  try {
    const careers = await generateCareerAnalysis({ skills, interests, goals });
    return res.status(200).json({ careers });
  } catch (err) {
    console.error("Career analyze error:", err);
    return res.status(500).json({ message: "Career analysis failed. Please try again." });
  }
});

export default router;
