const rdf = require('@rdfjs/data-model')
const { equals } = require('rdf-dataset-ext')

class Node {
  constructor ({ dataset, graph = rdf.defaultGraph(), term }) {
    if (!dataset) {
      throw new Error('dataset is a required argument')
    }

    if (!term) {
      throw new Error('term is a required argument')
    }

    this.dataset = dataset
    this.term = term
    this.graph = graph
  }

  equals (other) {
    return this.term.equals(other.term) && this.graph.equals(other.graph) && equals(this.dataset, other.dataset)
  }
}

module.exports = Node
