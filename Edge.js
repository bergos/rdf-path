const Node = require('./Node')
const { equals } = require('rdf-dataset-ext')

class Edge {
  constructor ({ dataset, dir, quad }) {
    if (!dataset) {
      throw new Error('dataset is a required argument')
    }

    if (!dir) {
      throw new Error('dir is a required argument')
    }

    if (!quad) {
      throw new Error('quad is a required argument')
    }

    this.dataset = dataset
    this.dir = dir
    this.quad = quad
  }

  get start () {
    if (this.dir === 'in') {
      return new Node({ dataset: this.dataset, term: this.quad.object, graph: this.quad.graph })
    }

    return new Node({ dataset: this.dataset, term: this.quad.subject, graph: this.quad.graph })
  }

  get end () {
    if (this.dir === 'in') {
      return new Node({ dataset: this.dataset, term: this.quad.subject, graph: this.quad.graph })
    }

    return new Node({ dataset: this.dataset, term: this.quad.object, graph: this.quad.graph })
  }

  equals (other) {
    return this.dir === other.dir && this.quad.equals(other.quad) && equals(this.dataset, other.dataset)
  }
}

module.exports = Edge
