/**
 * @param hex Hex color string with leading #
 */
export function hexToRgb(hex: string) {
  const parts = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
  return parts.map((part) => parseInt(part, 16)).join(' ')
}

/**
 * @param r Red component
 * @param g Green component
 * @param b Blue component
 */
export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}
