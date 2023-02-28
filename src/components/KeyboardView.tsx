import styles from '../styles/KeyboardView.module.scss'
import Key from './Key'
import keyMap from '../keyMap.json'
import type { KeyColor, KeyColorChangeHandler } from '../App'

interface Props {
  defaultColor: string
  customColors: KeyColor[]
  setKeyColor: KeyColorChangeHandler
}

export default function KeyboardView({
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
                    {...key}
                    slot={device.slot}
                    defaultColor={defaultColor}
                    keyColor={customColors.find(k => k.slot === device.slot && k.index === key.index)}
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
