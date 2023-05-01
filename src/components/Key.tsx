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
  const additionalStyles = { '--key-unit-width': width } as React.CSSProperties

  const changeColor = (newColor: string | null) => {
    setKeyColor({ layer, slot, index, color: newColor })
  }

  const resetColor = (e: React.MouseEvent) => {
    e.preventDefault()
    changeColor(null)
  }

  const id = `key-${layer}-${slot}-${index}`

  return (
    <div className={styles.key} style={additionalStyles} data-key-index={index}>
      <input
        id={id}
        type="color"
        value={color ?? defaultColor}
        onChange={(e) => changeColor(e.target.value)}
        onContextMenu={resetColor}
      />
      {showKeyLabels ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
    </div>
  )
}
