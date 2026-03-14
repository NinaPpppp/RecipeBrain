// evals/recipes-context.js
// Your real recipe collection — used as Gemini context during evals

export const recipesContext = [
  {
    id: "1", title: "Spaghetti Bolognese", youtubeUrl: "https://www.youtube.com/watch?v=VnYpoTM9ihc",
    thumbnailUrl: "https://i.ytimg.com/vi/VnYpoTM9ihc/hqdefault.jpg", channelName: "Adam Ragusea",
    metadata: { timeLevel: "Long", difficulty: "Medium", servings: 4 },
    tags: ["Dry Dishes"],
    ingredients: [{ name: "pancetta" }, { name: "ground beef and pork" }, { name: "tomato paste" }, { name: "white wine" }, { name: "whole milk" }],
    methodSummary: "A traditional milk-heavy meat sauce slow-cooked for several hours, served with egg pasta."
  },
  {
    id: "2", title: "One Pan Pasta", youtubeUrl: "https://www.youtube.com/watch?v=0VQEJARHJ44",
    thumbnailUrl: "https://i.ytimg.com/vi/0VQEJARHJ44/hqdefault.jpg", channelName: "Donal Skehan",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 2 },
    tags: ["Quick", "Dry Dishes"],
    ingredients: [{ name: "dry pasta" }, { name: "cherry tomatoes" }, { name: "garlic" }, { name: "fresh basil" }, { name: "pecorino cheese" }],
    methodSummary: "An effortless one-pot pasta where everything cooks together into a silky sauce."
  },
  {
    id: "3", title: "Spaghetti Carbonara", youtubeUrl: "https://www.youtube.com/watch?v=dsg5H2TEQXs",
    thumbnailUrl: "https://i.ytimg.com/vi/dsg5H2TEQXs/hqdefault.jpg", channelName: "Citalia",
    metadata: { timeLevel: "Quick", difficulty: "Medium", servings: 2 },
    tags: ["Quick", "Dry Dishes"],
    ingredients: [{ name: "spaghetti" }, { name: "guanciale" }, { name: "egg yolks" }, { name: "pecorino cheese" }, { name: "black pepper" }],
    methodSummary: "Classic Roman pasta with guanciale and egg-pecorino emulsion, no cream."
  },
  {
    id: "10", title: "Creamy Garlic Lemon Pasta", youtubeUrl: "https://www.youtube.com/watch?v=i84Sc5uvQa8",
    thumbnailUrl: "https://i.ytimg.com/vi/i84Sc5uvQa8/hqdefault.jpg", channelName: "Food Network",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 3 },
    tags: ["Quick", "Dry Dishes", "Vegetarian"],
    ingredients: [{ name: "spaghetti" }, { name: "garlic" }, { name: "lemon" }, { name: "thickened cream" }, { name: "parmesan" }],
    methodSummary: "A 15-minute pasta with garlic-cream sauce brightened with fresh lemon."
  },
  {
    id: "4", title: "Mi Xue Lemonade", youtubeUrl: "https://www.youtube.com/watch?v=pocCsJst2tc",
    thumbnailUrl: "https://i.ytimg.com/vi/pocCsJst2tc/hqdefault.jpg", channelName: "Greedy Daxin",
    metadata: { timeLevel: "Long", difficulty: "Intermediate", servings: 8 },
    tags: ["Beverage"],
    ingredients: [{ name: "lemons" }, { name: "white sugar" }, { name: "water" }, { name: "ice" }],
    methodSummary: "Lemonade using a cooked syrup from macerated lemon peels for a deep citrus base."
  },
  {
    id: "5", title: "Iced Matcha Latte", youtubeUrl: "https://www.youtube.com/shorts/S-M0MCddq0s",
    thumbnailUrl: "https://i.ytimg.com/vi/S-M0MCddq0s/hqdefault.jpg", channelName: "Brandon Chou",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 1 },
    tags: ["Quick", "Beverage"],
    ingredients: [{ name: "matcha powder" }, { name: "water" }, { name: "sweetener" }, { name: "milk" }, { name: "ice" }],
    methodSummary: "Whisked matcha concentrate blended with cold milk and served over ice."
  },
  {
    id: "6", title: "Starbucks Pink Drink", youtubeUrl: "https://www.youtube.com/watch?v=5ugvWTHcNnY",
    thumbnailUrl: "https://i.ytimg.com/vi/5ugvWTHcNnY/hqdefault.jpg", channelName: "Belly Full",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 1 },
    tags: ["Quick", "Beverage"],
    ingredients: [{ name: "fresh strawberries" }, { name: "White Cran-Strawberry Juice" }, { name: "vanilla coconut milk" }, { name: "crushed ice" }],
    methodSummary: "Three-ingredient fruit beverage replicating the cafe classic."
  },
  {
    id: "8", title: "Homemade Gnocchi", youtubeUrl: "https://www.youtube.com/watch?v=PLNEJFnG8gY",
    thumbnailUrl: "https://i.ytimg.com/vi/PLNEJFnG8gY/hqdefault.jpg", channelName: "Gordon Ramsay",
    metadata: { timeLevel: "Moderate", difficulty: "Medium", servings: 2 },
    tags: ["Vegetarian", "Dry Dishes"],
    ingredients: [{ name: "potatoes" }, { name: "ricotta" }, { name: "flour" }, { name: "egg" }, { name: "peas" }],
    methodSummary: "Potato and ricotta gnocchi blanched then pan-seared in butter for a crispy exterior."
  },
  {
    id: "9", title: "Chili Tofu Noodles", youtubeUrl: "https://www.youtube.com/watch?v=DCpKL0V5vbw",
    thumbnailUrl: "https://i.ytimg.com/vi/DCpKL0V5vbw/hqdefault.jpg", channelName: "So Vegan",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 1 },
    tags: ["Quick", "Dry Dishes", "Vegetarian"],
    ingredients: [{ name: "tofu" }, { name: "udon noodles" }, { name: "chili oil" }, { name: "soy sauce" }, { name: "garlic" }],
    methodSummary: "Crispy crumbled tofu over udon noodles in a sweet and spicy chili oil sauce."
  },
  {
    id: "11", title: "Vegetarian Dumplings", youtubeUrl: "https://www.youtube.com/watch?v=Zo_klJUfTdQ",
    thumbnailUrl: "https://i.ytimg.com/vi/Zo_klJUfTdQ/hqdefault.jpg", channelName: "TIFFYCOOKS",
    metadata: { timeLevel: "Moderate", difficulty: "Easy", servings: 2 },
    tags: ["Vegetarian", "Dry Dishes"],
    ingredients: [{ name: "cabbage" }, { name: "shiitake mushrooms" }, { name: "vermicelli noodles" }, { name: "dumpling wrappers" }, { name: "sesame oil" }],
    methodSummary: "Night market-style dumplings filled with sautéed mushrooms and vegetables."
  },
  {
    id: "12", title: "Hungarian Beef Goulash", youtubeUrl: "https://www.youtube.com/watch?v=VT2VBV74VTI",
    thumbnailUrl: "https://i.ytimg.com/vi/VT2VBV74VTI/hqdefault.jpg", channelName: "Chef Billy Parisi",
    metadata: { timeLevel: "Long", difficulty: "Medium", servings: 4 },
    tags: ["Soup Base"],
    ingredients: [{ name: "beef shank" }, { name: "sweet onions" }, { name: "Hungarian paprika" }, { name: "red wine" }, { name: "potatoes" }],
    methodSummary: "Deep, complex beef stew with caramelized onions and a long braise."
  },
  {
    id: "13", title: "Döner Kebab", youtubeUrl: "https://www.youtube.com/watch?v=SEVwZSq6hTE",
    thumbnailUrl: "https://i.ytimg.com/vi/SEVwZSq6hTE/hqdefault.jpg", channelName: "Marcooks",
    metadata: { timeLevel: "Long", difficulty: "Advance", servings: 4 },
    tags: ["Dry Dishes"],
    ingredients: [{ name: "ground beef" }, { name: "onion" }, { name: "Greek yogurt" }, { name: "paprika" }, { name: "flatbread" }],
    methodSummary: "Frozen spiced beef loaf shaved and pan-fried to mimic a vertical rotisserie."
  },
  {
    id: "14", title: "Pho", youtubeUrl: "https://www.youtube.com/watch?v=yslkYSjAPh4",
    thumbnailUrl: "https://i.ytimg.com/vi/yslkYSjAPh4/hqdefault.jpg", channelName: "Food Network",
    metadata: { timeLevel: "Long", difficulty: "Advance", servings: 4 },
    tags: ["Soup Base"],
    ingredients: [{ name: "thin sliced steak" }, { name: "rice noodles" }, { name: "star anise" }, { name: "ginger" }, { name: "fish sauce" }],
    methodSummary: "Aromatic beef noodle soup with a customized spice sachet broth."
  },
  {
    id: "21", title: "Quick Tonkotsu Ramen", youtubeUrl: "https://www.youtube.com/watch?v=2fBs5MNlK2s",
    thumbnailUrl: "https://i.ytimg.com/vi/2fBs5MNlK2s/hqdefault.jpg", channelName: "Way of Ramen",
    metadata: { timeLevel: "Moderate", difficulty: "Medium", servings: 4 },
    tags: ["Soup Base"],
    ingredients: [{ name: "pork bones" }, { name: "ramen noodles" }, { name: "soy sauce" }, { name: "chashu pork" }, { name: "green onions" }],
    methodSummary: "Pressure-cooked tonkotsu broth blended into a creamy, opaque ramen."
  },
  {
    id: "15", title: "Cheesecake", youtubeUrl: "https://www.youtube.com/watch?v=Ov4u0ARMWKQ",
    thumbnailUrl: "https://i.ytimg.com/vi/Ov4u0ARMWKQ/hqdefault.jpg", channelName: "Tasty",
    metadata: { timeLevel: "Moderate", difficulty: "Easy", servings: 8 },
    tags: ["Desserts"],
    ingredients: [{ name: "cream cheese" }, { name: "heavy cream" }, { name: "sour cream" }, { name: "graham crackers" }, { name: "vanilla bean" }],
    methodSummary: "Velvety baked cheesecake using a hot water bath for a crack-free finish."
  },
  {
    id: "16", title: "Matcha Tiramisu", youtubeUrl: "https://www.youtube.com/watch?v=6C7dmKQXBr0",
    thumbnailUrl: "https://i.ytimg.com/vi/6C7dmKQXBr0/hqdefault.jpg", channelName: "Sudachi",
    metadata: { timeLevel: "Moderate", difficulty: "Medium", servings: 8 },
    tags: ["Desserts"],
    ingredients: [{ name: "matcha powder" }, { name: "mascarpone" }, { name: "egg yolks" }, { name: "heavy cream" }, { name: "ladyfingers" }],
    methodSummary: "Japanese-inspired tiramisu with a cooked sugar sabayon and vibrant matcha layers."
  },
  {
    id: "17", title: "Neapolitan Pizza", youtubeUrl: "https://www.youtube.com/watch?v=8Q_9h6VKm9c",
    thumbnailUrl: "https://i.ytimg.com/vi/8Q_9h6VKm9c/hqdefault.jpg", channelName: "Vincenzo's Plate",
    metadata: { timeLevel: "Long", difficulty: "Advance", servings: 6 },
    tags: ["Dry Dishes"],
    ingredients: [{ name: "type 00 flour" }, { name: "water" }, { name: "salt" }, { name: "yeast" }],
    methodSummary: "Traditional Neapolitan dough with 24-hour room temperature maturation."
  },
  {
    id: "18", title: "Margherita Pizza", youtubeUrl: "https://www.youtube.com/watch?v=1-SJGQ2HLp8",
    thumbnailUrl: "https://i.ytimg.com/vi/1-SJGQ2HLp8/hqdefault.jpg", channelName: "Jamie Oliver",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 4 },
    tags: ["Quick", "Dry Dishes", "Vegetarian"],
    ingredients: [{ name: "strong flour" }, { name: "tomato sauce" }, { name: "mozzarella" }, { name: "parmesan" }, { name: "fresh basil" }],
    methodSummary: "Straightforward Margherita pizza with fresh mozzarella and a two-hour proof."
  },
  {
    id: "19", title: "Shokupan", youtubeUrl: "https://www.youtube.com/watch?v=snRdLFH3C9U",
    thumbnailUrl: "https://i.ytimg.com/vi/snRdLFH3C9U/hqdefault.jpg", channelName: "Yun's Family Table",
    metadata: { timeLevel: "Long", difficulty: "Advance", servings: 2 },
    tags: ["Desserts"],
    ingredients: [{ name: "bread flour" }, { name: "milk" }, { name: "heavy cream" }, { name: "egg" }, { name: "instant yeast" }],
    methodSummary: "Pillowy Japanese milk bread with a high-hydration enriched dough."
  },
  {
    id: "20", title: "Pain au Chocolat", youtubeUrl: "https://www.youtube.com/watch?v=79BRLkeyipk",
    thumbnailUrl: "https://i.ytimg.com/vi/79BRLkeyipk/hqdefault.jpg", channelName: "Hamza Gulzar",
    metadata: { timeLevel: "Moderate", difficulty: "Medium", servings: 6 },
    tags: ["Desserts"],
    ingredients: [{ name: "flour" }, { name: "butter" }, { name: "chocolate" }, { name: "instant yeast" }, { name: "egg" }],
    methodSummary: "Laminated pastry with multiple folds and chocolate filling for flaky layers."
  },
  {
    id: "22", title: "Salmon Sushi Bake", youtubeUrl: "https://www.youtube.com/watch?v=bPL_Xwa6BG0",
    thumbnailUrl: "https://i.ytimg.com/vi/bPL_Xwa6BG0/hqdefault.jpg", channelName: "One Happy Bite",
    metadata: { timeLevel: "Quick", difficulty: "Easy", servings: 4 },
    tags: ["Quick", "Dry Dishes"],
    ingredients: [{ name: "sushi rice" }, { name: "salmon" }, { name: "imitation crab" }, { name: "cream cheese" }, { name: "Sriracha mayo" }],
    methodSummary: "Deconstructed sushi casserole baked until hot and served in seaweed wraps."
  }
];