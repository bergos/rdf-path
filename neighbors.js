const Edge = require('./Edge')

function neighbors (node, { blacklist, dirIn, dirOut = true, followLiterals, whitelist, nodeBlacklist } = {}) {
  if (blacklist && whitelist) {
    throw new Error('blacklist or whitelist must be given, not both at the same time')
  }

  const edges = new Set()

  if (dirIn) {
    [...node.dataset.match(null, null, node.term, node.graph)].forEach(quad => {
      if (blacklist && blacklist.has(quad.predicate)) {
        return
      }

      if (whitelist && !whitelist.has(quad.predicate)) {
        return
      }

      if (nodeBlacklist && (nodeBlacklist.has(quad.object)||nodeBlacklist.has(quad.subject))) {
        return
      }

      edges.add(new Edge({ dataset: node.dataset, quad, dir: 'in' }))
    })
  }

  if (dirOut) {
    [...node.dataset.match(node.term, null, null, node.graph)].forEach(quad => {
      if (!followLiterals && quad.object.termType === 'Literal') {
        return
      }

      if (blacklist && blacklist.has(quad.predicate)) {
        return
      }

      if (whitelist && !whitelist.has(quad.predicate)) {
        return
      }

      if (nodeBlacklist && (nodeBlacklist.has(quad.object)||nodeBlacklist.has(quad.subject))) {
        return
      }

      edges.add(new Edge({ dataset: node.dataset, quad, dir: 'out' }))
    })
  }

  return edges
}

module.exports = neighbors
