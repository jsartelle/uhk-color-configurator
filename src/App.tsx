import { useState } from 'react'
import styles from './styles/App.module.scss'
import KeyboardView from './components/KeyboardView'
import MacroDisplay from './components/MacroDisplay'

export interface KeyColor {
  layer: number
  slot: number
  index: number
  color: string
}

export interface KeyColorChange {
  layer: number
  slot: number
  index: number
  color: string | null
}

export type KeyColorChangeHandler = (customColor: KeyColorChange) => void

// FIXME get all layer names
const layers = ['Base', 'Mod', 'Fn']

function App() {
  const [activeLayer, setActiveLayer] = useState(0)
  const [defaultColor, setDefaultColor] = useState('#ffffff')
  const [customColors, setCustomColors] = useState<KeyColor[]>([])

  const handleKeyColorChange: KeyColorChangeHandler = (keyColor) => {
    const newCustomColors = [...customColors]
    const index = newCustomColors.findIndex(
      (value) =>
        value.layer === keyColor.layer &&
        value.slot === keyColor.slot &&
        value.index === keyColor.index
    )
    if (index > -1) newCustomColors.splice(index, 1)
    if (keyColor.color !== null) newCustomColors.push(keyColor as KeyColor)
    setCustomColors(newCustomColors)
  }

  return (
    <main className={styles.app}>
      <fieldset className={styles.layerSelect}>
        <legend>Select Layer</legend>
        {layers.map((name, index) => (
          <label>
            <input
              type="radio"
              name="layer"
              value={index}
              defaultChecked={index === activeLayer}
              onChange={(e) => setActiveLayer(parseInt(e.target.value))}
            />
            <span>{name}</span>
          </label>
        ))}
      </fieldset>

      <KeyboardView
        activeLayer={activeLayer}
        defaultColor={defaultColor}
        customColors={customColors}
        setKeyColor={handleKeyColorChange}
      />

      <fieldset>
        <legend>Options</legend>

        <label>
          Default Color
          <input
            type="color"
            className={styles.defaultColorInput}
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
          />
        </label>
      </fieldset>

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
