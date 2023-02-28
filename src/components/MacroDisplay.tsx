import { useState, useEffect } from 'react'
import type { KeyColor } from '../App'
import keyMap from '../keyMap.json'
import styles from '../styles/MacroDisplay.module.scss'

/**
 * @param hex Hex color string with leading #
 */
export function hexToRgb(hex: string) {
  const parts = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
  return parts.map((part) => parseInt(part, 16)).join(' ')
}

/**
 * @param r Red component
 * @param g Green component
 * @param b Blue component
 */
export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

interface Props {
  defaultColor: string
  setDefaultColor: (defaultColor: string) => void
  customColors: KeyColor[]
  setCustomColors: (customColors: KeyColor[]) => void
}

export default function MacroDisplay({
  defaultColor,
  setDefaultColor,
  customColors,
  setCustomColors,
}: Props) {
  const [editMode, setEditMode] = useState(false)
  const [uniqueColors, setUniqueColors] = useState<string[]>([])
  const [editMacro, setEditMacro] = useState('')

  useEffect(() => {
    const colors: string[] = []
    colors.push(hexToRgb(defaultColor))
    for (const keyColor of customColors) {
      const colorRGB = hexToRgb(keyColor.color)
      if (!colors.includes(colorRGB)) colors.push(colorRGB)
    }
    setUniqueColors(colors)
  }, [defaultColor, customColors])

  function cancelEdit() {
    setEditMode(false)
    setEditMacro('')
  }

  function saveEdit() {
    setEditMode(false)

    const _uniqueColors: string[] = []
    const _customColors: KeyColor[] = []

    // Parse color values
    for (const line of editMacro.split('\n')) {
      const match = line.match(
        /perKey\.color\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/
      )

      if (!match) continue

      const index = parseInt(match[1])
      const r = parseInt(match[2])
      const g = parseInt(match[3])
      const b = parseInt(match[4])

      const hexColor = rgbToHex(r, g, b)

      if (index === 0) {
        setDefaultColor(hexColor)
      }
      _uniqueColors[index] = hexColor
    }

    // Parse key color mappings
    for (const line of editMacro.split('\n')) {
      const match = line.match(
        /perKey\.change\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/
      )

      if (!match) continue

      const layer = parseInt(match[1])
      const slot = parseInt(match[2])
      const index = parseInt(match[3])
      const colorIndex = parseInt(match[4])

      _customColors.push({
        layer,
        slot,
        index,
        color: _uniqueColors[colorIndex],
      })
    }

    // TODO sort
    setCustomColors(_customColors)
    setEditMacro('')
  }

  const macro = `set macroEngine.extendedCommands 1
set backlight.strategy perKey
set backlight.perKey.default_coloring 0

${uniqueColors
  .map((color, index) => `set backlight.perKey.color ${index} ${color}`)
  .join('\n')}

${customColors
  .map(({ layer, slot, index, color }) => {
    const paddedIndex = index.toString().padStart(2, '0')
    const paddedColor = uniqueColors
      .indexOf(hexToRgb(color))
      .toString()
      .padStart(uniqueColors.length.toString().length, '0')

    let label = Object.values(keyMap)
      .find((device) => device.slot === slot)!
      .keys.flat()
      .find((key) => key.index === index)!.label

    if (['Shift', 'Ctrl', 'Super', 'Alt', 'Fn'].includes(label)) {
      label = `${slot ? 'Left' : 'Right'} ${label}`
    }

    const line = `set backlight.perKey.change ${layer} ${slot} ${paddedIndex} ${paddedColor} # ${label}`

    return line
  })
  .join('\n')}
`
  return (
    <section className={styles.container}>
      <textarea
        readOnly={!editMode}
        className={styles.textarea}
        value={editMode ? editMacro : macro}
        onChange={(e) => (editMode ? setEditMacro(e.target.value) : null)}
      />
      {!editMode ? (
        <button
          className={styles.copy}
          onClick={() => navigator.clipboard.writeText(macro)}
        >
          Copy
        </button>
      ) : null}
      <div className={styles.buttons}>
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>
            Import Colors from Macro
          </button>
        ) : (
          <>
            <span>Paste a macro into the text field to import colors.</span>
            <button onClick={cancelEdit}>Cancel</button>
            <button onClick={saveEdit}>Import</button>
          </>
        )}
      </div>
    </section>
  )
}
