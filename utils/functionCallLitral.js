import pico from "picocolors"
import format from "./format.js"

export default function functionCallLitral(func, ...params) {
  const text = format("\"")(params, { colors: true }).slice(2, -2)

  let lines = text.split("\n")
  if (lines.length > 1) lines = lines.map((line) => line.slice(2))

  return (
    pico.blue(func) +
    pico.yellow("(") +
    pico.white(lines.join("\n")) +
    pico.yellow(")")
  )
}
