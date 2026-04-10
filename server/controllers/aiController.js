// ── Direct Gemini REST API (no SDK — avoids model name/version issues) ────────
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

const callGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// ── Robust JSON array extractor ───────────────────────────────────────────────
const extractJSONArray = (text = "") => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.error("JSON parse failed:", cleaned.slice(start, start + 300));
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// INTENT CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────
export const classifyIntent = async (message) => {
  const prompt = `You are an intent classifier for a career platform.

Classify this message into exactly one category:
- "chat" → general conversation, emotions, confusion, greetings, motivation, personal advice
- "career_analysis" → user explicitly asks for career suggestions, job options, career paths

Message: "${message}"

Reply with ONLY one word: chat OR career_analysis`;

  try {
    const text = await callGemini(prompt);
    const intent = text.trim().toLowerCase().replace(/[^a-z_]/g, "");
    return intent === "career_analysis" ? "career_analysis" : "chat";
  } catch (err) {
    console.error("Intent classification error:", err.message);
    return "chat";
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MENTOR CHAT
// ─────────────────────────────────────────────────────────────────────────────
export const generateMentorReply = async (message, history = []) => {
  const historyText = history
    .slice(-8)
    .map((m) => `${m.role === "user" ? "User" : "Mentor"}: ${m.content}`)
    .join("\n");

  const prompt = `You are AspireHub — a warm, brilliant, deeply human career mentor and life coach.

Your personality:
- Genuinely empathetic and caring
- Insightful and thoughtful — give real meaningful guidance
- Conversational and natural — like a trusted friend who knows careers deeply
- Reference earlier context naturally when relevant

How you respond:
- Write 4 to 6 sentences — enough to feel genuinely helpful
- Be warm, honest, real — never robotic or corporate
- If someone is confused or stressed: acknowledge their feeling first, then guide them
- Give perspective, examples, and a concrete direction or next thought
- End with ONE thoughtful follow-up question to move the conversation forward
- Write in natural flowing paragraphs — NO bullet points, NO lists, NO markdown

Conversation so far:
${historyText || "(start of conversation)"}

User: ${message}

Mentor:`;

  try {
    const text = await callGemini(prompt);
    return text.trim();
  } catch (err) {
    console.error("Mentor chat error:", err.message);
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CAREER ANALYSIS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export const generateCareerAnalysis = async ({ skills, interests, goals }) => {
  const prompt = `You are an elite AI career intelligence system.

Analyze this user profile and return exactly 6 career recommendations.

User Profile:
- Skills: ${skills || "Not specified"}
- Interests: ${interests || "Not specified"}
- Goals: ${goals || "Not specified"}

IMPORTANT: Return ONLY a valid JSON array. No text before or after. Start with [ and end with ].

[
  {
    "title": "Career title",
    "description": "2-3 sentences about what this role involves day-to-day",
    "why_fit": "One sentence explaining why this fits THIS specific user",
    "skills_required": ["skill1", "skill2", "skill3", "skill4"],
    "missing_skills": ["gap1", "gap2"],
    "roadmap": [
      "Step 1 — specific action",
      "Step 2 — specific action",
      "Step 3 — specific action",
      "Step 4 — specific action"
    ],
    "salary_range": "X-Y LPA (India) or $X-$Y (USD)",
    "growth_outlook": "High/Very High/Emerging — one sentence on future demand"
  }
]

Rules:
- Exactly 6 careers
- Diverse domains: tech, business, creative, healthcare, social impact, emerging roles
- At least 2 must be modern or non-obvious careers
- Personalize to the actual user profile
- Concrete actionable roadmap steps
- Return ONLY the JSON array, nothing else`;

  try {
    const text = await callGemini(prompt);
    console.log("Gemini raw (first 400):", text.slice(0, 400));

    const parsed = extractJSONArray(text);
    if (parsed && parsed.length > 0) return parsed;

    console.error("Could not extract JSON. Full response:", text);
    throw new Error("Invalid response format from Gemini.");
  } catch (err) {
    console.error("Career analysis error:", err.message);
    throw err;
  }
};