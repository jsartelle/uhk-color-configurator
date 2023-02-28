import styles from '../styles/KeyboardView.module.scss'
import Key from './Key'
import keyMap from '../keyMap.json'
import type { KeyColor, KeyColorChangeHandler } from '../App'

interface Props {
  activeLayer: number
  defaultColor: string
  splitLayout: boolean,
  showKeyLabels: boolean,
  customColors: KeyColor[]
  setKeyColor: KeyColorChangeHandler
}

export default function KeyboardView({
  activeLayer,
  defaultColor,
  splitLayout,
  showKeyLabels,
  customColors,
  setKeyColor,
}: Props) {
  let className = styles.container
  if (splitLayout) className += ` ${styles.split}`

  return (
    <section className={className}>
      {Object.entries(keyMap).map(([deviceName, device], index) => {
        return (
          <div className={styles[deviceName]} key={index}>
            {device.keys.map((row, index) => (
              <div className={styles.row} key={index}>
                {row.map((key) => (
                  <Key
                    key={key.index}
                    width={key.width}
                    layer={activeLayer}
                    slot={device.slot}
                    index={key.index}
                    label={key.label}
                    showKeyLabels={showKeyLabels}
                    defaultColor={defaultColor}
                    color={
                      customColors.find(
                        (c) =>
                          c.layer === activeLayer &&
                          c.slot === device.slot &&
                          c.index === key.index
                      )?.color
                    }
                    setKeyColor={setKeyColor}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </section>
  )
}
