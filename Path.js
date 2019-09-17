const { termToNTriples } = require('@rdfjs/to-ntriples')

class Path {
  constructor ({ dataset } = {}) {
    this.dataset = dataset
    this.edges = []
  }

  get length () {
    return this.edges.length
  }

  get out () {
    return this.edges.some(edge => edge.dir === 'out')
  }

  get in () {
    return this.edges.some(edge => edge.dir === 'in')
  }

  get start () {
    return this.node(0)
  }

  get end () {
    return this.node(this.length)
  }

  toString () {
    if (this.length === 0) {
      return ''
    }

    const parts = []

    for (let index = 0; index < this.length + 1; index++) {
      parts.push(termToNTriples(this.node(index).term))
    }

    return parts.join(', ')
  }

  clone () {
    const cloned = new Path()

    cloned.dataset = this.dataset
    cloned.edges = this.edges.slice()

    return cloned
  }

  node (index) {
    if (this.length === 0) {
      return undefined
    }

    if (index < 0) {
      return undefined
    }

    if (index > this.length) {
      return undefined
    }

    if (index === this.length) {
      return this.edges[index - 1].end
    }

    return this.edges[index].start
  }

  append (edge) {
    if (!this.dataset) {
      this.dataset = edge.dataset
    }

    if (this.dataset !== edge.dataset) {
      throw new Error('path can\'t be defined over multiple datasets')
    }

    this.edges.push(edge)

    return this
  }
}

module.exports = Path
