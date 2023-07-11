const neighbors = require('./neighbors')
const Path = require('./Path')
const TermSet = require('@rdfjs/term-set')

function shortest (start, end, { blacklist, cutoff = Number.MAX_SAFE_INTEGER, dirIn, dirOut = true, followLiterals, whitelist, nodeBlacklist } = {}) {
  if (blacklist && whitelist) {
    throw new Error('blacklist or whitelist must be given, not both at the same time')
  }

  let todo = [new Path({ dataset: start.dataset })]
  const done = new TermSet()

  while (todo.length > 0 && todo[0].length < cutoff) {
    const next = []

    for (const path of todo) {
      const edges = neighbors(path.end || start, { blacklist, dirIn, dirOut, followLiterals, whitelist, nodeBlacklist })

      for (const edge of edges) {
        if (done.has(edge.end.term)) {
          continue
        }

        const expanded = path.clone().append(edge)

        if (edge.end.term.equals(end.term)) {
          return expanded
        }

        next.push(expanded)
        done.add(edge.end.term)
      }
    }

    todo = next
  }

  return null
}

module.exports = shortest
