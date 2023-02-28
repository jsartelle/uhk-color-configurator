import styles from '../styles/KeyboardView.module.scss'
import Key from './Key'
import keyMap from '../keyMap.json'
import type { KeyColor, KeyColorChangeHandler } from '../App'

interface Props {
  activeLayer: number
  defaultColor: string
  customColors: KeyColor[]
  setKeyColor: KeyColorChangeHandler
}

export default function KeyboardView({
  activeLayer,
  defaultColor,
  customColors,
  setKeyColor,
}: Props) {
  return (
    <section className={styles.container}>
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
