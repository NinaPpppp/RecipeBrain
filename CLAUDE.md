# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# RecipeBrain — AI-Driven YouTube Recipe Cookbook App

## Project Overview
RecipeBrain is an AI-driven mobile web app that turns saved YouTube
recipe videos (Shorts and long-form) into an organized, searchable
cookbook. Users import YouTube links, the app extracts ingredients,
steps, cook time, difficulty, and dietary tags into structured recipe
cards. An AI chat assistant lets users filter, compare, and discover
what to cook based on ingredients on hand, mood, available time, and
preferences.

## UI Structure
The app is a mobile-first single-page experience (440px wide × 956px height,
simulating a phone screen) with the following screens/states:

1. **Home Screen** — Recipe grid sourced from `recipes.js`, shuffled each
   session. Search bar filters by title, channelName, cuisine, and tags.
   Horizontal filter chips generated from recipe tags (All + unique tags).
   Recipe cards show thumbnail, title, cook time, difficulty, and tags;
   play button opens the YouTube URL in a new tab. "+" button top-right
   to add recipes. Floating AI chat button bottom-right.

2. **Chat Sheet — Starter State** — Slides up as a bottom sheet over
   the home screen. Shows AI icon, 2 contextual suggestion chips,
   and a text input. No messages yet.

3. **Chat Sheet — Active State** — Same sheet with an active
   conversation. Three message display modes:
   - Deep Dive: Single recipe card with thumbnail, title, channel, cook
     time, difficulty, key ingredients, and Watch Video button linking to YouTube
   - Filter & Discovery: Scrollable list of matching recipe cards with
     thumbnail, title, cook time, and play button linking to YouTube
   - Comparison: Horizontally scrollable side-by-side table with
     drag-to-scroll support, showing thumbnail, title, cook time,
     difficulty, key ingredients, and equipment rows with uniform row heights

4. **Add Recipe — URL Input State** — Full screen with "Add Recipe"
   title, Cancel button, and a single URL paste input field.

5. **Add Recipe — Processing State** — Same screen with URL shown,
   skeleton loading card, and "Extracting recipe details..." spinner.

6. **Add Recipe — Review & Confirm State** — Extracted recipe card
   preview with image, title, creator, cook time, difficulty,
   description, detected ingredients, editable tags, and
   "Save to Collection" button.

7. **Success Signal** — Centered checkmark icon with "Recipe saved!"
   message. Auto-redirects to Home Screen.

## Tech Stack
- React (Vite, JSX only — no TypeScript)
- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`)
- Google Gemini 2.5 Flash (via REST API) for AI chat
- Environment variable: `VITE_GEMINI_API_KEY` in `.env`
- Mobile-first layout (440px × 956px, no border radius)
- Figma MCP connected for design reference

## Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Production build
npm run preview  # Preview production build
```

## File Structure

```
src/
  App.jsx               # Root — mounts the phone shell and active screen
  index.css             # Tailwind import + phone shell styles + utility classes
  main.jsx              # Vite entry point
  data/
    recipes.js          # 20 pre-seeded YouTube recipe entries (static JSON)
  screens/
    HomeScreen.jsx
    ChatSheet.jsx
    AddRecipeScreen.jsx
  hooks/
    useDragScroll.js    # Mouse drag-to-scroll for horizontal scroll containers
  services/
    gemini.js           # Gemini 2.5 Flash API integration
  assets/
    fonts/
      PaperCutRegular.otf
    images/
      BG_IllusFigma.png
```

## Recipe Data Schema
Each entry in `recipes.js` has this shape:

```js
{
  id: string,
  title: string,
  youtubeUrl: string,
  thumbnailUrl: string,
  channelName: string,
  videoType: 'short' | 'long',
  metadata: {
    timeLevel: string,   // e.g. "15 min"
    difficulty: string,  // e.g. "Easy" | "Medium" | "Advanced"
    servings: number,
  },
  tags: string[],        // e.g. ["Quick", "Vegetarian", "Italian"]
  equipment: string[],   // e.g. ["Wok", "Chef's knife"]
  ingredients: [
    { name: string, quantity: string, unit: string }
  ],
  methodSummary: string, // 1–2 sentence overview
  fullSteps: string[],   // ordered cooking steps
}
```

## AI Chat Architecture
- **Context stuffing** — the full `recipes` array is sent with every Gemini request
- **Response format** — Gemini is instructed to respond in plain text only with
  strict short formats (no markdown, no bullet points, no elaboration)
- **Card type detection** — detected from the AI response text prefix:
  - `"Here's your"` → `deepdive` (single recipe)
  - `"Found"` → `filter` (multiple matching recipes)
  - `"Here's how"` → `comparison` (side-by-side table)
- **Structured reply** — Gemini returns a JSON envelope `{ responseType, message, recipeIds }`
  which `ChatSheet.jsx` parses to select the correct card component

## Design System (from Figma)
- App name font: Bold yellow rounded display font ("RecipeBrain")
- Primary blue: #3B7BF6 (buttons, AI icon, active states)
- Background: #F2F2F2 (light gray)
- Card background: White with subtle rounded corners and shadow
- Filter chips: Pill-shaped, black fill for active, white/outlined for inactive
- Decorative blobs: Orange, green, yellow, red — visible on home screen background
- AI chat header: Star icon + "RecipeBrain" label
- Recipe cards: Thumbnail top, title + metadata + tags below
- Success screen: Minimal, centered, light gray background

## Design Implementation Rules
- Always use Figma MCP tools when implementing each screen
- Fetch the Figma design for each screen before writing any code
- Match colors, spacing, typography, and component layout exactly
- All screens are mobile (440px × 956px, no border radius), centered in browser if on desktop
- Do not invent UI that isn't in the Figma design

## Screen Build Order
1. Home Screen
2. Chat Starter State + Active Chat States
3. URL Input → Processing → Review & Confirm → Success Signal
