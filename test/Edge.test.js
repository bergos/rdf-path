/* global describe, it, expect */

const dataModelFactory = require('@rdfjs/data-model')
const datasetFactory = require('@rdfjs/dataset')
const noop = require('./support/noop')
const Edge = require('../Edge')
const Node = require('../Node')

const rdf = { ...dataModelFactory, ...datasetFactory }

describe('Edge', () => {
  it('should be a constructor', () => {
    expect(typeof Edge).toBe('function')
  })

  it('should should throw an error if dataset is not given', () => {
    const quad = {}
    const dir = 'out'

    expect(() => {
      noop(new Edge({ quad, dir }))
    }).toThrow()
  })

  it('should assign the given dataset to .dataset', () => {
    const dataset = {}
    const quad = {}
    const dir = 'out'

    const edge = new Edge({ dataset, quad, dir })

    expect(edge.dataset).toBe(dataset)
  })

  it('should should throw an error if quad is not given', () => {
    const dataset = {}
    const dir = 'out'

    expect(() => {
      noop(new Edge({ dataset, dir }))
    }).toThrow()
  })

  it('should assign the given quad to .quad', () => {
    const dataset = {}
    const quad = {}
    const dir = 'out'

    const edge = new Edge({ dataset, quad, dir })

    expect(edge.quad).toBe(quad)
  })

  it('should should throw an error if dir is not given', () => {
    const dataset = {}
    const quad = {}

    expect(() => {
      noop(new Edge({ dataset, quad }))
    }).toThrow()
  })

  it('should assign the given dir to .dir', () => {
    const dataset = {}
    const quad = {}
    const dir = 'out'

    const edge = new Edge({ dataset, quad, dir })

    expect(edge.dir).toBe(dir)
  })

  describe('.start', () => {
    it('should be a Node object', () => {
      const dataset = {}
      const quad = { subject: {}, graph: {} }
      const dir = 'out'
      const edge = new Edge({ dataset, quad, dir })

      const start = edge.start

      expect(start instanceof Node).toBe(true)
    })

    it('should be a Node created with dataset, quad.subject and quad.graph for dir=in', () => {
      const dataset = {}
      const quad = { subject: {}, graph: {} }
      const dir = 'out'
      const edge = new Edge({ dataset, quad, dir })

      const start = edge.start

      expect(start.dataset).toBe(dataset)
      expect(start.term).toBe(quad.subject)
      expect(start.graph).toBe(quad.graph)
    })

    it('should be a Node created with dataset, quad.object and quad.graph for dir=out', () => {
      const dataset = {}
      const quad = { object: {}, graph: {} }
      const dir = 'in'
      const edge = new Edge({ dataset, quad, dir })

      const start = edge.start

      expect(start.dataset).toBe(dataset)
      expect(start.term).toBe(quad.object)
      expect(start.graph).toBe(quad.graph)
    })
  })

  describe('.end', () => {
    it('should be a Node object', () => {
      const dataset = {}
      const quad = { object: {}, graph: {} }
      const dir = 'out'
      const edge = new Edge({ dataset, quad, dir })

      const end = edge.end

      expect(end instanceof Node).toBe(true)
    })

    it('should be a Node created with dataset, quad.subject and quad.graph for dir=in', () => {
      const dataset = {}
      const quad = { object: {}, graph: {} }
      const dir = 'out'
      const edge = new Edge({ dataset, quad, dir })

      const end = edge.end

      expect(end.dataset).toBe(dataset)
      expect(end.term).toBe(quad.object)
      expect(end.graph).toBe(quad.graph)
    })

    it('should be a Node created with dataset, quad.object and quad.graph for dir=out', () => {
      const dataset = {}
      const quad = { subject: {}, graph: {} }
      const dir = 'in'
      const edge = new Edge({ dataset, quad, dir })

      const end = edge.end

      expect(end.dataset).toBe(dataset)
      expect(end.term).toBe(quad.subject)
      expect(end.graph).toBe(quad.graph)
    })
  })

  describe('.equals', () => {
    it('should be a method', () => {
      const dataset = {}
      const quad = {}
      const dir = 'out'

      const edge = new Edge({ dataset, quad, dir })

      expect(typeof edge.equals).toBe('function')
    })

    it('should return true if quad, dir and dataset are equal', () => {
      const subjectIri = 'http://example.org/subject'
      const predicateIri = 'http://example.org/predicate'
      const quad = rdf.quad(rdf.namedNode(subjectIri), rdf.namedNode(predicateIri), rdf.blankNode())
      const dataset = rdf.dataset([quad])
      const dir = 'out'
      const edgeA = new Edge({ dataset, quad, dir })
      const edgeB = new Edge({ dataset, quad, dir })

      expect(edgeA.equals(edgeB)).toBe(true)
    })

    it('should return false if the datasets is not equal', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quadA = rdf.quad(subject, predicate, rdf.literal('a'))
      const quadB = rdf.quad(subject, predicate, rdf.literal('b'))
      const datasetA = rdf.dataset([quadA])
      const datasetB = rdf.dataset([quadA, quadB])
      const dir = 'out'
      const edgeA = new Edge({ dataset: datasetA, quad: quadA, dir })
      const edgeB = new Edge({ dataset: datasetB, quad: quadA, dir })

      expect(edgeA.equals(edgeB)).toBe(false)
    })

    it('should compare the datasets using equals', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quad = rdf.quad(subject, predicate, rdf.literal('a'))
      const datasetA = rdf.dataset([quad])
      const datasetB = rdf.dataset([quad])
      const dir = 'out'
      const edgeA = new Edge({ dataset: datasetA, quad, dir })
      const edgeB = new Edge({ dataset: datasetB, quad, dir })

      expect(edgeA.equals(edgeB)).toBe(true)
    })

    it('should return false if the quads is not equal', () => {
      const subjectA = rdf.namedNode('http://example.org/subjectA')
      const subjectB = rdf.namedNode('http://example.org/subjectA')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quadA = rdf.quad(subjectA, predicate, rdf.literal('a'))
      const quadB = rdf.quad(subjectB, predicate, rdf.literal('b'))
      const datasetA = rdf.dataset([quadA, quadB])
      const datasetB = rdf.dataset([quadB, quadB])
      const dir = 'out'
      const edgeA = new Edge({ dataset: datasetA, quad: quadA, dir })
      const edgeB = new Edge({ dataset: datasetB, quad: quadB, dir })

      expect(edgeA.equals(edgeB)).toBe(false)
    })

    it('should compare the quads using .equals', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quadA = rdf.quad(subject, predicate, rdf.blankNode())
      const quadB = rdf.quad(subject, predicate, quadA.object)
      const dataset = rdf.dataset([quadA])
      const dir = 'out'
      const edgeA = new Edge({ dataset, quad: quadA, dir })
      const edgeB = new Edge({ dataset, quad: quadB, dir })

      expect(edgeA.equals(edgeB)).toBe(true)
    })

    it('should return false if the dirs is not equal', () => {
      const subject = rdf.namedNode('http://example.org/subject')
      const predicate = rdf.namedNode('http://example.org/predicate')
      const quad = rdf.quad(subject, predicate, rdf.blankNode())
      const dataset = rdf.dataset([quad])
      const dirA = 'out'
      const dirB = 'in'
      const edgeA = new Edge({ dataset, quad, dir: dirA })
      const edgeB = new Edge({ dataset, quad, dir: dirB })

      expect(edgeA.equals(edgeB)).toBe(false)
    })
  })
})
