import styles from '../styles/Key.module.scss'
import type { KeyColor, KeyColorChangeHandler } from '../App'

interface Props {
  width: number
  slot: number
  index: number
  defaultColor: string
  keyColor?: KeyColor,
  setKeyColor: KeyColorChangeHandler
}

export default function Key({
  width,
  slot,
  index,
  defaultColor,
  keyColor,
  setKeyColor,
}: Props) {
  // TODO option to show default key labels
  const additionalStyles = { '--width': width } as React.CSSProperties

  const changeColor = (newColor: string | null) => {
    setKeyColor({ slot, index, color: newColor })
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
        data-color={keyColor?.color}
        value={keyColor?.color ?? defaultColor}
        onChange={e => changeColor(e.target.value)}
        onContextMenu={resetColor}
      />
    </div>
  )
}
