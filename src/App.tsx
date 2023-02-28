import { useState } from 'react'
import styles from './styles/App.module.scss'
import KeyboardView from './components/KeyboardView'
import MacroDisplay from './components/MacroDisplay'

export interface KeyColor {
  slot: number
  index: number
  color: string
}

export interface KeyColorChange {
  slot: number
  index: number
  color: string | null
}

export type KeyColorChangeHandler = (customColor: KeyColorChange) => void

function App() {
  // TODO support layers
  const [defaultColor, setDefaultColor] = useState('#ffffff')
  const [customColors, setCustomColors] = useState<KeyColor[]>([])

  const handleKeyColorChange: KeyColorChangeHandler = (keyColor) => {
    const newCustomColors = [...customColors]
    const index = newCustomColors.findIndex(
      (value) => value.slot === keyColor.slot && value.index === keyColor.index
    )
    if (index > -1) newCustomColors.splice(index, 1)
    if (keyColor.color !== null) newCustomColors.push(keyColor as KeyColor)
    setCustomColors(newCustomColors)
  }

  return (
    <main className={styles.app}>
      <KeyboardView
        defaultColor={defaultColor}
        customColors={customColors}
        setKeyColor={handleKeyColorChange}
      />

      <label>
        Default Color
        <input
          type="color"
          value={defaultColor}
          onChange={(e) => setDefaultColor(e.target.value)}
        />
      </label>

      <MacroDisplay
        defaultColor={defaultColor}
        setDefaultColor={setDefaultColor}
        customColors={customColors}
        setCustomColors={setCustomColors}
      />
    </main>
  )
}

export default App
