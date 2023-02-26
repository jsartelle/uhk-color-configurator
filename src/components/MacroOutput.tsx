import { useState, useEffect } from 'react'
import styles from '../styles/MacroOutput.module.scss'
import type { KeyColor } from '../App'

interface Props {
  defaultColor: string
  customColors: KeyColor[]
}

/**
 * @param hex Hex color string with leading #
 */
function hexToRgb(hex: string) {
  const parts = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
  return parts.map((part) => parseInt(part, 16)).join(' ')
}

export default function MacroOutput({ defaultColor, customColors }: Props) {
  const [uniqueColors, setUniqueColors] = useState<string[]>([])

  useEffect(() => {
    const colors: string[] = []
    colors.push(hexToRgb(defaultColor))
    for (const keyColor of customColors) {
      const colorRGB = hexToRgb(keyColor.color)
      if (!colors.includes(colorRGB)) colors.push(colorRGB)
    }
    setUniqueColors(colors)
  }, [defaultColor, customColors])

  const macro = `set macroEngine.extendedCommands 1
set backlight.strategy perKey
set backlight.perKey.default_coloring 0

${uniqueColors
  .map((color, index) => `set backlight.perKey.color ${index} ${color}`)
  .join('\n')}

${customColors
  .map(
    ({ slot, index, color }) =>
      `set backlight.perKey.change 0 ${slot} ${index} ${uniqueColors.indexOf(
        hexToRgb(color)
      )}`
  )
  .join('\n')}
`
  return (
    <div className={styles.container}>
      <textarea readOnly className={styles.textarea} value={macro} />
      <button
        className={styles.copy}
        onClick={() => navigator.clipboard.writeText(macro)}
      >
        Copy
      </button>
    </div>
  )
}
