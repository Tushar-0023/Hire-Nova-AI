import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================================
   WAIT HELPER
========================================================= */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================
   AI CANDIDATE ANALYSIS
========================================================= */

export const analyzeCandidate = async (jobTitle, resume) => {
  const prompt = `
You are HireNova AI, an intelligent recruitment matching system.

Your task is to evaluate a candidate for a specific JOB TITLE.

IMPORTANT:
The recruiter provides ONLY the job title.
You must automatically determine the relevant technical skills, tools,
technologies, knowledge areas, and typical requirements normally expected
for that job role.

Do NOT use a fixed or hardcoded skill list.
Do NOT assume that every job requires React, Node.js, SQL, MongoDB, etc.
The expected skills must be determined dynamically from the JOB TITLE.

JOB TITLE:
${jobTitle}

CANDIDATE SKILLS / RESUME:
${resume}

Analyze the candidate against the skills and requirements that are
actually relevant to this job title.

For example:
- Full Stack Developer → consider relevant frontend, backend, database,
  API, version control and full-stack technologies.
- Frontend Developer → focus primarily on frontend technologies and
  frontend development knowledge.
- Backend Developer → focus primarily on backend, APIs, databases and
  server-side technologies.
- Flutter Developer → consider Flutter, Dart, mobile development,
  state management, APIs, etc.
- Java Developer → consider Java, OOP, Spring/Spring Boot, APIs,
  databases, etc.
- AI/ML Developer → consider Python, machine learning, data processing,
  relevant ML frameworks and related knowledge.

These are only examples. Determine the appropriate requirements
dynamically for whatever job title is provided.

SCORING:
- Score from 0 to 100.
- Give a higher score when the candidate has most of the important
  skills expected for the role.
- Give a lower score when important role-specific skills are missing.
- Do not give a high score merely because the candidate has many skills.
- Relevance to the specific job title is what matters.
- Do not invent skills in the candidate resume.
- Do not assume experience that is not provided.

MATCHED SKILLS:
Include important skills that are both:
1. Relevant to the job title.
2. Clearly present in the candidate's submitted skills/resume.

MISSING SKILLS:
Include important skills normally expected for the job title that are
not clearly present in the candidate's submitted skills/resume.

EXPERIENCE MATCH:
Return exactly one:
"Strong"
"Moderate"
"Weak"

Base this on the evidence available in the candidate input.
Do not invent years of experience.

Return ONLY valid JSON in exactly this structure:

{
  "score": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "experienceMatch": "Strong",
  "explanation": ""
}

Rules:
- score must be an integer from 0 to 100.
- matchedSkills must be an array of strings.
- missingSkills must be an array of strings.
- experienceMatch must be exactly "Strong", "Moderate", or "Weak".
- explanation must briefly explain the score.
- Do not invent candidate skills or experience.
- Do not use a fixed universal skill list.
- Do not include markdown.
- Return JSON only.
`;

  /* =========================================================
     RETRY SETTINGS
  ========================================================= */

  const maxAttempts = 4;

  // 2 sec → 4 sec → 8 sec
  const retryDelays = [2000, 4000, 8000];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `🤖 AI analysis attempt ${attempt}/${maxAttempts}...`,
      );

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text.trim();

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const result = JSON.parse(cleanedText);

      console.log("✅ AI analysis successful.");

      return result;
    } catch (error) {
      console.error(
        `❌ AI Matching Error - Attempt ${attempt}/${maxAttempts}:`,
        error,
      );

      /*
       * Retry temporary Gemini availability errors.
       */
      const status = error?.status || error?.code;

      if (status === 503 || status === "UNAVAILABLE") {
        if (attempt < maxAttempts) {
          const delay = retryDelays[attempt - 1];

          console.log(
            `⏳ Gemini temporarily unavailable. Retrying in ${
              delay / 1000
            } seconds...`,
          );

          await wait(delay);

          continue;
        }

        console.error(
          "❌ Gemini still unavailable after all retry attempts.",
        );

        throw new Error(
          "AI service temporarily unavailable. Please try again later.",
        );
      }

      /*
       * JSON parsing or other non-temporary errors
       * should not be retried unnecessarily.
       */
      throw new Error("AI candidate analysis failed");
    }
  }

  throw new Error("AI candidate analysis failed");
};
