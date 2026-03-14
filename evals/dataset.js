export const dataset = [
  // DEEP DIVE — user asks about one specific recipe
  { input: "Tell me about the spaghetti carbonara", expectedCardType: "deepdive", label: "deepdive_carbonara" },
  { input: "What's in the homemade gnocchi?", expectedCardType: "deepdive", label: "deepdive_gnocchi" },
  { input: "Show me the cheesecake recipe", expectedCardType: "deepdive", label: "deepdive_cheesecake" },
  { input: "How do I make the matcha tiramisu?", expectedCardType: "deepdive", label: "deepdive_matcha_tiramisu" },
  { input: "Walk me through the tonkotsu ramen", expectedCardType: "deepdive", label: "deepdive_ramen" },
  { input: "Give me details on the pho", expectedCardType: "deepdive", label: "deepdive_pho" },
  { input: "What ingredients do I need for the pain au chocolat?", expectedCardType: "deepdive", label: "deepdive_pain_au_chocolat" },

  // FILTER — user describes a vibe, ingredient, or constraint
  { input: "What can I cook that's quick?", expectedCardType: "filter", label: "filter_quick" },
  { input: "Show me all my vegetarian recipes", expectedCardType: "filter", label: "filter_vegetarian" },
  { input: "I have garlic and pasta, what can I make?", expectedCardType: "filter", label: "filter_by_ingredients" },
  { input: "What soup recipes do I have?", expectedCardType: "filter", label: "filter_soups" },
  { input: "Give me something for dessert", expectedCardType: "filter", label: "filter_desserts" },
  { input: "What drinks can I make?", expectedCardType: "filter", label: "filter_beverages" },
  { input: "I'm lazy, what's easy to cook?", expectedCardType: "filter", label: "filter_easy" },
  { input: "Find me something comforting and warm", expectedCardType: "filter", label: "filter_mood_comfort" },
  { input: "What can I make with matcha?", expectedCardType: "filter", label: "filter_by_ingredient_matcha" },

  // COMPARISON — user wants to compare multiple recipes
  { input: "Compare my pasta recipes", expectedCardType: "comparison", label: "comparison_pasta" },
  { input: "Which of my desserts is easiest to make?", expectedCardType: "comparison", label: "comparison_desserts_easy" },
  { input: "Compare the neapolitan pizza and margherita pizza", expectedCardType: "comparison", label: "comparison_two_pizzas" },
  { input: "How do my soup recipes stack up against each other?", expectedCardType: "comparison", label: "comparison_soups" },
  { input: "Which is harder — the cheesecake or the matcha tiramisu?", expectedCardType: "comparison", label: "comparison_two_desserts" },
  { input: "Compare my quick recipes by difficulty", expectedCardType: "comparison", label: "comparison_quick_difficulty" },
];