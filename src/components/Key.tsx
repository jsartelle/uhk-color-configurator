import styles from '../styles/Key.module.scss'
import type { KeyColorChangeHandler } from '../App'

interface Props {
  width: number
  layer: number
  slot: number
  index: number
  label: string
  showKeyLabels: boolean
  defaultColor: string
  color?: string
  setKeyColor: KeyColorChangeHandler
}

export default function Key({
  width,
  layer,
  slot,
  index,
  label,
  showKeyLabels,
  defaultColor,
  color,
  setKeyColor,
}: Props) {
  const additionalStyles = { '--width': width } as React.CSSProperties

  const changeColor = (newColor: string | null) => {
    setKeyColor({ layer, slot, index, color: newColor })
  }

  const resetColor = (e: React.MouseEvent) => {
    e.preventDefault()
    changeColor(null)
  }

  return (
    <div className={styles.key} style={additionalStyles} data-key-index={index}>
      <input
        type="color"
        value={color ?? defaultColor}
        onChange={(e) => changeColor(e.target.value)}
        onContextMenu={resetColor}
      />
      {showKeyLabels ? (
        <span className={styles.label}>{label}</span>
      ) : null}
    </div>
  )
}
