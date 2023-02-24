import { useState } from 'react'
import styles from '../styles/Key.module.scss'
import type { KeyColorChangeHandler } from '../App'

interface Props {
  width: number
  slot: number
  index: number
  defaultColor: string
  onKeyColorChange: KeyColorChangeHandler
}

export default function Key({
  width,
  slot,
  index,
  defaultColor,
  onKeyColorChange,
}: Props) {
  // TODO option to show default key labels
  const [color, setColor] = useState<string | null>(null)
  const additionalStyles = { '--width': width } as React.CSSProperties

  const changeColor = (newColor: string | null) => {
    setColor(newColor)
    onKeyColorChange({ slot, index, color: newColor })
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
        onChange={e => changeColor(e.target.value)}
        onContextMenu={resetColor}
      />
    </div>
  )
}
