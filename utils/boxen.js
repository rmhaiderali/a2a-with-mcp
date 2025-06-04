import boxen from "boxen"
import format from "./format.js"

export default function (items, opts = {}) {
  const text = items
    .map((item) => format("\"")(item, { colors: true, depth: null }))
    .join("\n:boxen:\n")

  const options = { padding: { left: 1, right: 1 }, ...opts }

  return boxen(text, options).replace(
    /( *)((?:\x1B\[\d{2,3}m)*)│((?:\x1B\[\d{2,3}m)*)( *:boxen: *)((?:\x1B\[\d{2,3}m)*)│((?:\x1B\[\d{2,3}m)*)/g,
    (match, g1, g2, g3, g4, g5, g6) => {
      //
      const empty = `${g1}${g2}│${" ".repeat(g4.length)}│${g6}`
      const border = `${g1}${g2}├${"─".repeat(g4.length)}┤${g6}`
      //
      return (
        (empty + "\n").repeat(options.padding?.bottom || options.padding || 0) +
        border +
        ("\n" + empty).repeat(options.padding?.top || options.padding || 0)
      )
    }
  )
}
