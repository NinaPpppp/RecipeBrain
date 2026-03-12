const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function extractVideoId(url) {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      const shortsMatch = u.pathname.match(/^\/shorts\/([^/?]+)/)
      if (shortsMatch) return shortsMatch[1]
    }
  } catch {
    // fall through
  }
  return null
}

function isYouTubeUrl(url) {
  try {
    const u = new URL(url)
    return u.hostname === 'youtu.be' || u.hostname.includes('youtube.com')
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS_HEADERS).end()
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body || {}

  if (!url || !isYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  const videoId = extractVideoId(url)
  if (!videoId) {
    return res.status(400).json({ error: 'Could not extract video ID from URL' })
  }

  // Fetch oEmbed metadata for title and channel name
  let title = ''
  let channelName = ''
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    )
    if (oembedRes.ok) {
      const oembed = await oembedRes.json()
      title = oembed.title || ''
      channelName = oembed.author_name || ''
    }
  } catch {
    // Non-fatal — Gemini will infer from the video itself
  }

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  // Send the YouTube video URL directly to Gemini — it understands video natively
  const prompt = `You are a recipe data extractor. Watch this YouTube cooking video and extract structured recipe data. Return ONLY a valid JSON object with no markdown, no backticks, no explanation. Use exactly this schema:
{
  "title": string,
  "channelName": string,
  "youtubeUrl": string,
  "thumbnailUrl": string,
  "videoType": "short" | "long-form",
  "metadata": {
    "timeLevel": "Quick" | "Moderate" | "Long",
    "difficulty": "Easy" | "Medium" | "Hard",
    "servings": number
  },
  "tags": string[],
  "equipment": string[],
  "ingredients": [{ "name": string, "quantity": string, "unit": string }],
  "methodSummary": string (maximum 2 sentences, be concise),
  "fullSteps": string[]
}

For timeLevel use: Quick (under 30 mins), Moderate (30-60 mins), Long (over 60 mins).
For difficulty use: Easy, Medium, Hard.
For videoType use: short or long-form.
Tags should be 2-5 descriptive labels like cuisine type, dietary style, or occasion.
Set youtubeUrl to: ${url}
Set thumbnailUrl to: ${thumbnailUrl}
${title ? `The video title is: ${title}` : ''}
${channelName ? `The channel name is: ${channelName}` : ''}`

  let geminiText = ''
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                fileData: {
                  mimeType: 'video/*',
                  fileUri: url,
                }
              },
              { text: prompt }
            ]
          }]
        }),
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}))
      console.error('Gemini error:', err)
      return res.status(502).json({ error: 'AI extraction failed' })
    }

    const geminiData = await geminiRes.json()
    geminiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (e) {
    console.error('Gemini fetch failed:', e)
    return res.status(502).json({ error: 'AI extraction failed' })
  }

  if (!geminiText) {
    return res.status(502).json({ error: 'AI extraction failed' })
  }

  // Strip markdown fences if present and parse JSON
  const cleaned = geminiText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('No JSON in Gemini response:', geminiText)
    return res.status(502).json({ error: 'Could not parse recipe from AI response' })
  }

  let recipe
  try {
    recipe = JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('JSON parse failed:', e, jsonMatch[0])
    return res.status(502).json({ error: 'Could not parse recipe from AI response' })
  }

  // Always use the real URL and thumbnail, not anything Gemini might hallucinate
  recipe.youtubeUrl = url
  recipe.thumbnailUrl = thumbnailUrl

  return res.status(200).json(recipe)
}
