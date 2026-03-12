import { useState } from 'react'
import './index.css'
import HomeScreen from './screens/HomeScreen'
import ChatSheet from './screens/ChatSheet'
import AddRecipeScreen from './screens/AddRecipeScreen'
import { RECIPES } from './data/recipes'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAddOpen,  setIsAddOpen]  = useState(false)

  return (
    <div id="phone-shell">
      <HomeScreen
        recipes={RECIPES}
        onChatOpen={() => setIsChatOpen(true)}
        onAddOpen={() => setIsAddOpen(true)}
      />
      <ChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} recipes={RECIPES} />
      <AddRecipeScreen isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  )
}

export default App
