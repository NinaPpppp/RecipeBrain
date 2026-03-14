// evals/eval.js
import Braintrust from "braintrust";
import dotenv from "dotenv";
import { dataset } from "./dataset.js";
import { recipesContext } from "./recipes-context.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");
if (!process.env.BRAINTRUST_API_KEY) throw new Error("Missing BRAINTRUST_API_KEY in .env");

// ── System prompt — copied exactly from your gemini.js ──────────────────────
const SYSTEM_PROMPT = `You are RecipeBrain, an AI assistant that helps users navigate their saved YouTube recipe collection. Always respond in plain text only. No markdown, asterisks, bullet points, or special formatting.

Follow these strict response format rules:

1. If the user asks about one specific recipe, respond with exactly:
"Here's your [recipe title] from [channelName]."
Nothing more.

2. If the user describes a vibe, constraint, mood, or available ingredients and multiple recipes match, respond with exactly:
"Found [N] recipes in your collection that match."
Nothing more. Do not list the recipes. Do not explain.

3. If the user explicitly asks to compare two or more recipes, respond with exactly:
"Here's how your [N] [cuisine or shared descriptor] recipes compare."
Nothing more. Do not list differences. Do not explain.

Never elaborate. Never list options in the text. The UI will show the recipe cards separately.

IMPORTANT: You must ALWAYS respond with a single valid JSON object and nothing else. No markdown, no code blocks, no extra text before or after the JSON.

The JSON format is exactly:
{
  "responseType": "deepdive" | "filter" | "comparison" | "text",
  "message": "Your response here following the strict format rules above",
  "recipeIds": ["id1", "id2"]
}

Rules for responseType:
- "deepdive": user asks about ONE specific recipe in detail. recipeIds contains that recipe's id.
- "filter": user asks for recommendations or matching recipes (2 or more results). recipeIds lists the matching recipe ids.
- "comparison": user wants to compare 2 or more recipes side by side, OR asks which of a group is best/easiest/quickest/hardest, OR uses phrasing like "which of my X is most/least Y". recipeIds lists the recipe ids to compare.
- "text": general question with no specific recipes to show, or a greeting. recipeIds is [].

Use the exact id values from the recipe collection. Never invent ids.`

// ── Call Gemini ──────────────────────────────────────────────────────────────
async function callGemini(userMessage) {
  const fullPrompt = `${SYSTEM_PROMPT}

Here is the user's complete recipe collection:
${JSON.stringify(recipesContext, null, 2)}

User: ${userMessage}`;

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Extract JSON from response (same logic as your production gemini.js)
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text.trim();
}

// ── Scorer ───────────────────────────────────────────────────────────────────
function cardTypeScorer({ output, expected }) {
  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    return {
      name: "CardTypeMatch",
      score: 0,
      metadata: { error: "Response was not valid JSON", rawOutput: output.slice(0, 120) },
    };
  }

  const detected = parsed.responseType ?? "unknown";
  const correct = detected === expected.expectedCardType;

  return {
    name: "CardTypeMatch",
    score: correct ? 1 : 0,
    metadata: {
      detected,
      expected: expected.expectedCardType,
      message: parsed.message ?? "",
      recipeIds: parsed.recipeIds ?? [],
    },
  };
}

// ── Run eval ─────────────────────────────────────────────────────────────────
await Braintrust.Eval("RecipeBrain Chat Format", {
  data: dataset.map((item) => ({
    input: item.input,
    expected: item,
    metadata: { label: item.label },
  })),
  task: async (input) => await callGemini(input),
  scores: [cardTypeScorer],
});