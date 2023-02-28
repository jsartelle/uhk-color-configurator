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
  const [splitLayout, setSplitLayout] = useState(true)
  const [showKeyLabels, setShowKeyLabels] = useState(true)
  // TODO save/load from localStorage, add reset button
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
        splitLayout={splitLayout}
        showKeyLabels={showKeyLabels}
        customColors={customColors}
        setKeyColor={handleKeyColorChange}
      />

      <fieldset className={styles.options}>
        <legend>Options</legend>

        <label>
          <input
            type="color"
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
          />
          <span>Default Color</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={splitLayout}
            onChange={(e) => setSplitLayout(!splitLayout)}
          />
          <span>Split Layout</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={showKeyLabels}
            onChange={(e) => setShowKeyLabels(!showKeyLabels)}
          />
          <span>Show Key Labels</span>
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
