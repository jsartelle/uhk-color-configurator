import { useState, useEffect } from 'react'
import colorNamer from 'color-namer'
import { hexToRgb, rgbToHex } from '../utils/color'
import type { KeyColor } from '../App'
import keyMap from '../keyMap.json'
import styles from '../styles/MacroDisplay.module.scss'

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

    const colorsHex: string[] = []
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
      colorsHex[index] = hexColor
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
        color: colorsHex[colorIndex],
      })
    }

    // TODO sort
    setCustomColors(_customColors)
  }

  const macro = `set macroEngine.extendedCommands 1
set backlight.strategy perKey
set backlight.perKey.default_coloring 0

${uniqueColors
  .map((color, index) => {
    const names = colorNamer(`rgb(${color.replaceAll(' ', ',')})`, {
      pick: ['pantone'],
    })
    return `set backlight.perKey.color ${index} ${color} # ${names.pantone[0].name}`
  })
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

    label = label.replace('•', 'Cluster') // bullet doesn't render in Agent
    if (['Shift', 'Ctrl', 'Super', 'Alt', 'Fn'].includes(label)) {
      label = `${slot ? 'Left' : 'Right'} ${label}`
    }

    const line = `set backlight.perKey.change ${layer} ${slot} ${paddedIndex} ${paddedColor} # ${label}`

    return line
  })
  .join('\n')}
`
  return (
    <section>
      <h2>Macro</h2>

      <div className={styles.macroContainer}>
        <textarea
          readOnly={!editMode}
          className={styles.macro}
          value={editMode ? editMacro : macro}
          onChange={(e) => (editMode ? setEditMacro(e.target.value) : null)}
        />
        {!editMode ? (
          <span
            role="button"
            className={`${styles.copyButton} secondary`}
            onClick={() => navigator.clipboard.writeText(macro)}
          >
            Copy
          </span>
        ) : null}
      </div>

      <div className={styles.buttons}>
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Import Macro</button>
        ) : (
          <>
            <span className={styles.editDescription}>
              <span>Paste a macro into the text field to import it.</span>
              <br />
              <span className={styles.editWarning}>
                Make sure you have enabled the right layers before importing!
              </span>
            </span>
            <span role="button" className="secondary" onClick={cancelEdit}>
              Cancel
            </span>
            <span role="button" onClick={saveEdit}>
              Import
            </span>
          </>
        )}
      </div>
    </section>
  )
}
