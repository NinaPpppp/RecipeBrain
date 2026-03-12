import { useState } from 'react'
import './index.css'
import HomeScreen from './screens/HomeScreen'
import ChatSheet from './screens/ChatSheet'
import AddRecipeScreen from './screens/AddRecipeScreen'
import { RECIPES } from './data/recipes'

function App() {
  const [isChatOpen,       setIsChatOpen]       = useState(false)
  const [isAddOpen,        setIsAddOpen]         = useState(false)
  const [importedRecipes,  setImportedRecipes]   = useState([])
  const [importCount,      setImportCount]       = useState(0)

  const allRecipes = [...importedRecipes, ...RECIPES]

  function handleRecipeImported(recipe) {
    const withId = { ...recipe, id: `imported-${Date.now()}` }
    setImportedRecipes(prev => [withId, ...prev])
    setImportCount(prev => prev + 1)
  }

  return (
    <div id="phone-shell">
      <HomeScreen
        recipes={allRecipes}
        onChatOpen={() => setIsChatOpen(true)}
        onAddOpen={() => setIsAddOpen(true)}
      />
      <ChatSheet
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipes={allRecipes}
      />
      <AddRecipeScreen
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onRecipeImported={handleRecipeImported}
        importCount={importCount}
      />
    </div>
  )
}

export default App
