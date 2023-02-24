import styles from '../styles/KeyboardView.module.scss'
import Key from './Key'
import keyMap from '../keyMap.json'
import type { KeyColorChangeHandler } from '../App'

interface Props {
  defaultColor: string
  onKeyColorChange: KeyColorChangeHandler
}

export default function KeyboardView({
  defaultColor,
  onKeyColorChange,
}: Props) {
  return (
    <div className={styles.container}>
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
                    onKeyColorChange={onKeyColorChange}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
