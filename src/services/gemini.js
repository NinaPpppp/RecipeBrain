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
- "comparison": user wants to compare 2 or more recipes side by side. recipeIds lists the recipe ids to compare.
- "text": general question with no specific recipes to show, or a greeting. recipeIds is [].

Use the exact id values from the recipe collection. Never invent ids.`

export async function callGemini(userMessage, recipes) {
  const fullPrompt = `${SYSTEM_PROMPT}

Here is the user's complete recipe collection:
${JSON.stringify(recipes, null, 2)}

User: ${userMessage}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: 800,
          },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Gemini API error:', err)
      return JSON.stringify({ responseType: 'text', message: "Sorry, I couldn't reach the AI right now. Please try again.", recipeIds: [] })
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return JSON.stringify({ responseType: 'text', message: "I got a response but couldn't read it. Please try again.", recipeIds: [] })
    }

    // Gemini sometimes wraps JSON in code fences or adds preamble/trailing text.
    // Extract the JSON object directly so JSON.parse always succeeds in ChatSheet.
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      console.warn('Gemini response had no JSON object:', text)
      return JSON.stringify({ responseType: 'text', message: text.trim(), recipeIds: [] })
    }
    return match[0]
  } catch (e) {
    console.error('Gemini fetch failed:', e)
    return JSON.stringify({ responseType: 'text', message: "Something went wrong connecting to the AI. Check your internet connection and try again.", recipeIds: [] })
  }
}
