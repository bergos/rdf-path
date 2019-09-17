/* global describe, it, expect */

const dataModelFactory = require('@rdfjs/data-model')
const datasetFactory = require('@rdfjs/dataset')
const noop = require('./support/noop')
const Node = require('../Node')

const rdf = { ...dataModelFactory, ...datasetFactory }

describe('Node', () => {
  it('should be a constructor', () => {
    expect(typeof Node).toBe('function')
  })

  it('should throw an error if dataset is not given', () => {
    const term = {}

    expect(() => {
      noop(new Node({ term }))
    }).toThrow()
  })

  it('should assign the given dataset to .dataset', () => {
    const dataset = {}
    const term = {}

    const node = new Node({ dataset, term })

    expect(node.dataset).toBe(dataset)
  })

  it('should throw an error if term is not given', () => {
    const dataset = {}

    expect(() => {
      noop(new Node({ dataset }))
    }).toThrow()
  })

  it('should assign the given term to .term', () => {
    const dataset = {}
    const term = {}

    const node = new Node({ dataset, term })

    expect(node.term).toBe(term)
  })

  it('should assign defaultGraph to .graph is graph argument is not given', () => {
    const dataset = {}
    const term = {}

    const node = new Node({ dataset, term })

    expect(rdf.defaultGraph().equals(node.graph)).toBe(true)
  })

  it('should assign the given graph to .graph', () => {
    const dataset = {}
    const term = {}
    const graph = {}

    const node = new Node({ dataset, term, graph })

    expect(node.graph).toBe(graph)
  })

  describe('.equals', () => {
    it('should be a method', () => {
      const dataset = {}
      const term = {}
      const node = new Node({ dataset, term })

      expect(typeof node.equals).toBe('function')
    })

    it('should return true if dataset, graph and term are equal', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quad = rdf.quad(subject, predicate, rdf.blankNode())
      const dataset = rdf.dataset([quad])
      const nodeA = new Node({ dataset, term: quad.subject })
      const nodeB = new Node({ dataset, term: quad.subject })

      expect(nodeA.equals(nodeB)).toBe(true)
    })

    it('should return false if the datasets are not equal', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quadA = rdf.quad(subject, predicate, rdf.literal('a'))
      const quadB = rdf.quad(subject, predicate, rdf.literal('b'))
      const datasetA = rdf.dataset([quadA])
      const datasetB = rdf.dataset([quadB])
      const nodeA = new Node({ dataset: datasetA, term: subject })
      const nodeB = new Node({ dataset: datasetB, term: subject })

      expect(nodeA.equals(nodeB)).toBe(false)
    })

    it('should compare the datasets using equals', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quad = rdf.quad(subject, predicate, rdf.blankNode())
      const datasetA = rdf.dataset([quad])
      const datasetB = rdf.dataset([quad])
      const nodeA = new Node({ dataset: datasetA, term: subject })
      const nodeB = new Node({ dataset: datasetB, term: subject })

      expect(nodeA.equals(nodeB)).toBe(true)
    })

    it('should return false if the terms are not equal', () => {
      const subjectA = rdf.namedNode('http://example.org/subjectA')
      const subjectB = rdf.namedNode('http://example.org/subjectA')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quadA = rdf.quad(subjectA, predicate, rdf.literal('a'))
      const quadB = rdf.quad(subjectB, predicate, rdf.literal('b'))
      const datasetA = rdf.dataset([quadA, quadB])
      const datasetB = rdf.dataset([quadB, quadB])
      const nodeA = new Node({ dataset: datasetA, term: subjectA })
      const nodeB = new Node({ dataset: datasetB, term: subjectB })

      expect(nodeA.equals(nodeB)).toBe(false)
    })

    it('should compare the terms using .equals', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quad = rdf.quad(subject, predicate, rdf.blankNode())
      const dataset = rdf.dataset([quad])
      const nodeA = new Node({ dataset, term: rdf.namedNode(subject.value) })
      const nodeB = new Node({ dataset, term: rdf.namedNode(subject.value) })

      expect(nodeA.equals(nodeB)).toBe(true)
    })

    it('should return false if the graphs are not equal', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const graphA = rdf.namedNode('http://example.org/graphA')
      const graphB = rdf.namedNode('http://example.org/graphB')
      const quadA = rdf.quad(subject, predicate, rdf.literal('a'), graphA)
      const quadB = rdf.quad(subject, predicate, rdf.literal('b'), graphB)
      const datasetA = rdf.dataset([quadA, quadB])
      const datasetB = rdf.dataset([quadB, quadB])
      const nodeA = new Node({ dataset: datasetA, term: subject, graph: graphA })
      const nodeB = new Node({ dataset: datasetB, term: subject, graph: graphB })

      expect(nodeA.equals(nodeB)).toBe(false)
    })

    it('should compare the graphs using .equals', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const graph = rdf.namedNode('http://example.org/graph')
      const quad = rdf.quad(subject, predicate, rdf.blankNode(), graph)
      const dataset = rdf.dataset([quad])
      const nodeA = new Node({ dataset, term: subject, graph: rdf.namedNode(graph.value) })
      const nodeB = new Node({ dataset, term: subject, graph: rdf.namedNode(graph.value) })

      expect(nodeA.equals(nodeB)).toBe(true)
    })
  })
})
