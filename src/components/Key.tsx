import styles from '../styles/Key.module.scss'
import type { KeyColor, KeyColorChangeHandler } from '../App'

interface Props {
  width: number
  layer: number
  slot: number
  index: number
  defaultColor: string
  color?: string
  setKeyColor: KeyColorChangeHandler
}

export default function Key({
  width,
  layer,
  slot,
  index,
  defaultColor,
  color,
  setKeyColor,
}: Props) {
  // TODO option to show default key labels, and save them as comments in the output
  const additionalStyles = { '--width': width } as React.CSSProperties

  const changeColor = (newColor: string | null) => {
    setKeyColor({ layer, slot, index, color: newColor })
  }

  const resetColor = (e: React.MouseEvent) => {
    e.preventDefault()
    changeColor(null)
  }

  return (
    <div className={styles.key} style={additionalStyles}>
      <input
        type="color"
        data-key-index={index}
        value={color ?? defaultColor}
        onChange={(e) => changeColor(e.target.value)}
        onContextMenu={resetColor}
      />
    </div>
  )
}
