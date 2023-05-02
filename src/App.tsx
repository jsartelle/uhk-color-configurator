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

const defaultLayers = {
  Base: true,
  Mod: true,
  Mouse: true,
  Fn: true,
  Fn2: false,
  Fn3: false,
  Fn4: false,
  Fn5: false,
  Shift: false,
  Ctrl: false,
  Alt: false,
  Super: false,
}

const themeQuery = window.matchMedia('(prefers-color-scheme: dark)')
const changeThemeColor = () => {
  document
    .querySelector('meta[name=theme-color]')
    ?.setAttribute('content', themeQuery.matches ? '#11191f' : '#fff')
}
changeThemeColor()
themeQuery.addEventListener('change', changeThemeColor)

// TODO accessibility pass

function App() {
  const [layers, setLayers] = useState({ ...defaultLayers })
  const [activeLayer, setActiveLayer] = useState(0)
  const [editLayers, setEditLayers] = useState(false)
  // FIXME override Pico theme colors
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
    <>
      <main className={['container', styles.container].join(' ')}>
        <hgroup>
          <h1>UHK Color Configurator</h1>
          <p>Right click a key to reset to the default color.</p>
        </hgroup>

        <KeyboardView
          activeLayer={activeLayer}
          defaultColor={defaultColor}
          splitLayout={splitLayout}
          showKeyLabels={showKeyLabels}
          customColors={customColors}
          setKeyColor={handleKeyColorChange}
        />

        <section>
          <h2>Active Layer</h2>
          <fieldset className={styles.layerList}>
            {editLayers
              ? Object.entries(layers).map(([name, value], index) => (
                  <label key={index} className={styles.layer}>
                    <input
                      type="checkbox"
                      name="layer"
                      disabled={index === 0}
                      checked={value}
                      onChange={() => setLayers({ ...layers, [name]: !value })}
                    />
                    <span>{name}</span>
                  </label>
                ))
              : Object.entries(layers)
                  .filter(([, value]) => value)
                  .map(([name], index) => (
                    <label key={index} className={styles.layer}>
                      <input
                        type="radio"
                        name="layer"
                        value={index}
                        checked={index === activeLayer}
                        onChange={(e) =>
                          setActiveLayer(parseInt(e.target.value))
                        }
                      />
                      <span>{name}</span>
                    </label>
                  ))}
          </fieldset>

          {/* FIXME when layers are changed update macro appropriately */}
          <button onClick={() => setEditLayers(!editLayers)}>
            {editLayers ? 'Save' : 'Edit Layers...'}
          </button>
        </section>

        <section>
          <h2>Settings</h2>
          <fieldset>
            <label>
              <input
                className={styles.defaultColor}
                type="color"
                value={defaultColor}
                onChange={(e) => setDefaultColor(e.target.value)}
              />
              <span>Default Color</span>
            </label>

            <label>
              <input
                type="checkbox"
                role="switch"
                checked={splitLayout}
                onChange={(e) => setSplitLayout(!splitLayout)}
              />
              <span>Split Layout</span>
            </label>

            <label>
              <input
                type="checkbox"
                role="switch"
                checked={showKeyLabels}
                onChange={(e) => setShowKeyLabels(!showKeyLabels)}
              />
              <span>Show Key Labels</span>
            </label>
          </fieldset>
        </section>

        <MacroDisplay
          defaultColor={defaultColor}
          setDefaultColor={setDefaultColor}
          customColors={customColors}
          setCustomColors={setCustomColors}
        />
      </main>

      <footer>
        <a
          href="https://github.com/jsartelle/uhk-color-configurator"
          target="_blank"
          rel="noreferrer"
        >
          View Source
        </a>
      </footer>
    </>
  )
}

export default App
