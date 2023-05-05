import { useLongPress } from 'use-long-press'
import styles from '../styles/Key.module.scss'
import { getContrast } from '../utils/color'
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

  const resetColor = (e?: React.MouseEvent) => {
    e?.preventDefault()
    changeColor(null)
  }

  const longPressBind = useLongPress(() => resetColor())

  const id = `key-${layer}-${slot}-${index}`

  const keyColor = color ?? defaultColor
  // TODO move this calculation to the time of storing the color
  const contrastColor = getContrast(keyColor)

  // TODO allow dragging colors between keys
  return (
    <div
      className={styles.key}
      style={additionalStyles}
      data-key-index={index}
      onContextMenu={resetColor}
      {...longPressBind()}
    >
      {/* TODO move to React Color and pre-populate palette with currently used colors https://casesandberg.github.io/react-color/#api-individual */}
      <input
        id={id}
        type="color"
        value={keyColor}
        draggable="false"
        onChange={(e) => changeColor(e.target.value)}
      />
      {showKeyLabels ? (
        <label
          htmlFor={id}
          className={styles.label}
          data-contrast-color={contrastColor}
        >
          {label}
        </label>
      ) : null}
    </div>
  )
}
