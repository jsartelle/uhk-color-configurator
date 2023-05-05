import { useState } from 'react'
import { useLongPress } from 'use-long-press'
import KeyboardView from './components/KeyboardView'
import MacroDisplay from './components/MacroDisplay'
import styles from './styles/App.module.scss'
import useLocalStorage from './utils/useLocalStorage'

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
  const [layers, setLayers, resetDefaultLayers] = useLocalStorage('layers', {
    ...defaultLayers,
  })
  const [activeLayer, setActiveLayer, resetActiveLayer] = useLocalStorage(
    'activeLayer',
    0
  )
  const [editLayers, setEditLayers] = useState(false)
  // TODO override Pico theme colors
  const [defaultColor, setDefaultColor, resetDefaultColor] = useLocalStorage(
    'defaultColor',
    '#ffffff'
  )
  const [splitLayout, setSplitLayout, resetSplitLayout] = useLocalStorage(
    'splitLayout',
    true
  )
  const [showKeyLabels, setShowKeyLabels, resetShowKeyLabels] = useLocalStorage(
    'showKeyLabels',
    true
  )
  const [customColors, setCustomColors, resetCustomColors] = useLocalStorage<
    KeyColor[]
  >('customColors', [])

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

  const resetDefaultColorBind = useLongPress(() => resetDefaultColor())

  const reset = () => {
    if (window.confirm('Reset your current colors and settings?')) {
      resetDefaultLayers()
      resetActiveLayer()
      resetDefaultColor()
      resetSplitLayout()
      resetShowKeyLabels()
      resetCustomColors()
    }
  }

  return (
    <>
      <main className={['container', styles.container].join(' ')}>
        <section>
          <hgroup>
            <h1>UHK Color Configurator</h1>
            <p>
              Right click or long press a key to reset to the default color.
            </p>
          </hgroup>

          <KeyboardView
            activeLayer={activeLayer}
            defaultColor={defaultColor}
            splitLayout={splitLayout}
            showKeyLabels={showKeyLabels}
            customColors={customColors}
            setKeyColor={handleKeyColorChange}
          />
        </section>

        <section>
          <h2>Active Layer</h2>
          <fieldset className={styles.layerList}>
            {editLayers
              ? Object.entries(layers).map(([name, value], index) => (
                  // FIXME handle active layer being hidden
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

        {/* TODO add setup instructions */}

        <section>
          <h2>Settings</h2>
          <fieldset>
            <label>
              <input
                className={styles.defaultColor}
                type="color"
                value={defaultColor}
                onChange={(e) => setDefaultColor(e.target.value)}
                onContextMenu={resetDefaultColor}
                draggable="false"
                {...resetDefaultColorBind()}
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

            <span role="button" className={styles.resetButton} onClick={reset}>
              Reset Everything
            </span>
          </fieldset>
        </section>

        <MacroDisplay
          defaultColor={defaultColor}
          setDefaultColor={setDefaultColor}
          customColors={customColors}
          setCustomColors={setCustomColors}
        />

        <details>
          <summary>View State (debug)</summary>
          <label>
            customColors
            <textarea
              readOnly={true}
              className={styles.debugView}
              value={JSON.stringify(customColors, null, '\t')}
            />
          </label>
        </details>
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
