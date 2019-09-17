/* global describe, it, expect */

const createEdge = require('./support/createEdge')
const createPath = require('./support/createPath')
const dataModelFactory = require('@rdfjs/data-model')
const datasetFactory = require('@rdfjs/dataset')
const Node = require('../Node')
const Path = require('../Path')

const rdf = { ...dataModelFactory, ...datasetFactory }

describe('Path', () => {
  it('should be a constructor', () => {
    expect(typeof Path).toBe('function')
  })

  it('should assign the given dataset to .dataset', () => {
    const dataset = {}

    const path = new Path({ dataset })

    expect(path.dataset).toBe(dataset)
  })

  it('should init .edges with an empty array', () => {
    const path = new Path()

    expect(Array.isArray(path.edges)).toBe(true)
    expect(path.edges.length).toBe(0)
  })

  describe('.length', () => {
    it('should be a number property', () => {
      const path = new Path()

      expect(typeof path.length).toBe('number')
    })

    it('should be 0 for an empty path', () => {
      const path = new Path()

      expect(path.length).toBe(0)
    })

    it('should be equals to the number of edges of the path', () => {
      const path = createPath({ length: 2 })

      expect(path.length).toBe(2)
    })
  })

  describe('.in', () => {
    it('should be a boolean property', () => {
      const path = new Path()

      expect(typeof path.in).toBe('boolean')
    })

    it('should be false for an empty path', () => {
      const path = new Path()

      expect(path.in).toBe(false)
    })

    it('should be true if the path contains edges only with dir in', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1, dir: 'in' }))

      expect(path.in).toBe(true)
    })

    it('should be true if the path contains edges with dir in and dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1 }))
      path.edges.push(createEdge({ path, subject: 1, object: 2, dir: 'in' }))

      expect(path.in).toBe(true)
    })

    it('should be false if the path contains edges only with dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1 }))

      expect(path.in).toBe(false)
    })
  })

  describe('.out', () => {
    it('should be a boolean property', () => {
      const path = new Path()

      expect(typeof path.out).toBe('boolean')
    })

    it('should be false for an empty path', () => {
      const path = new Path()

      expect(path.out).toBe(false)
    })

    it('should be true if the path contains edges only with dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1 }))

      expect(path.out).toBe(true)
    })

    it('should be true if the path contains edges with dir in and dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1 }))
      path.edges.push(createEdge({ path, subject: 1, object: 2, dir: 'in' }))

      expect(path.out).toBe(true)
    })

    it('should be false if the path contains edges only with dir in', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1, dir: 'in' }))

      expect(path.out).toBe(false)
    })
  })

  describe('.start', () => {
    it('should be a Node object', () => {
      const path = createPath({ length: 1 })

      expect(path.start instanceof Node).toBe(true)
    })

    it('should be undefined for an empty path', () => {
      const path = new Path()

      expect(typeof path.start).toBe('undefined')
    })

    it('should be the subject of the first edge with dir in', () => {
      const path = createPath({ length: 2 })

      expect(path.start.term.equals(path.edges[0].quad.subject)).toBe(true)
    })

    it('should be the object of the first edge with dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1, dir: 'in' }))

      expect(path.start.term.equals(path.edges[0].quad.object)).toBe(true)
    })
  })

  describe('.end', () => {
    it('should be a Node object', () => {
      const path = createPath({ length: 1 })

      expect(path.end instanceof Node).toBe(true)
    })

    it('should be undefined for an empty path', () => {
      const path = new Path()

      expect(typeof path.end).toBe('undefined')
    })

    it('should be the object of the last edge with dir in', () => {
      const path = createPath({ length: 2 })

      expect(path.end.term.equals(path.edges[1].quad.object)).toBe(true)
    })

    it('should be the object of the first edge with dir out', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 2, object: 1, dir: 'in' }))
      path.edges.push(createEdge({ path, subject: 1, object: 0, dir: 'in' }))

      expect(path.end.term.equals(path.edges[1].quad.subject)).toBe(true)
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const path = new Path()

      expect(typeof path.toString).toBe('function')
    })

    it('should return an empty to for an empty path', () => {
      const path = new Path()

      expect(path.toString()).toBe('')
    })

    it('should return a comma separated list of the terms of the node in N-Triples representation', () => {
      const path = createPath()
      path.edges.push(createEdge({ path, subject: 0, object: 1 }))
      path.edges.push(createEdge({ path, subject: 1, object: 2, dir: 'in' }))

      expect(path.toString()).toBe('<http://example.org/0>, <http://example.org/2>, <http://example.org/1>')
    })
  })

  describe('.clone', () => {
    it('should be a method', () => {
      const path = new Path()

      expect(typeof path.clone).toBe('function')
    })

    it('should return a Path object', () => {
      const path = new Path()

      expect(path.clone() instanceof Path).toBe(true)
    })

    it('should assign the same dataset to the clone', () => {
      const path = createPath()

      expect(path.clone().dataset).toBe(path.dataset)
    })

    it('should assign a copy of the edges array', () => {
      const path = createPath({ length: 2 })
      const clone = path.clone()

      expect(clone.edges).not.toBe(path.edges)
      expect(clone.edges).toEqual(path.edges)
    })
  })

  describe('.node', () => {
    it('should be a method', () => {
      const path = new Path()

      expect(typeof path.node).toBe('function')
    })

    it('should return a Node object', () => {
      const path = createPath({ length: 2 })

      expect(path.node(0) instanceof Node).toBe(true)
    })

    it('should return undefined for an empty path', () => {
      const path = new Path()

      expect(typeof path.node(0)).toBe('undefined')
    })

    it('should return undefined for an index smaller 0', () => {
      const path = createPath({ length: 2 })

      expect(typeof path.node(-1)).toBe('undefined')
    })

    it('should return undefined for an index after the last node', () => {
      const path = createPath({ length: 2 })

      expect(typeof path.node(3)).toBe('undefined')
    })

    it('should return start of the edge with the given index', () => {
      const path = createPath({ length: 2 })

      expect(path.node(0).equals(path.edges[0].start)).toBe(true)
    })

    it('should return end of the edge with the given index - 1 for the last node', () => {
      const path = createPath({ length: 2 })

      expect(path.node(2).equals(path.edges[1].end)).toBe(true)
    })
  })

  describe('.append', () => {
    it('should be a method', () => {
      const path = new Path()

      expect(typeof path.append).toBe('function')
    })

    it('should return the path itself', () => {
      const path = createPath()
      const edge = createEdge({ path, subject: 0, object: 1 })

      expect(path.append(edge)).toBe(path)
    })

    it('should appends the edge to the edges array', () => {
      const path = createPath({ length: 2 })
      const edge = createEdge({ path, subject: 0, object: 1 })

      path.append(edge)

      expect(path.edges[2]).toBe(edge)
    })

    it('should assigns the dataset of the edge to the path', () => {
      const path = new Path()
      const dataset = rdf.dataset()
      const edge = createEdge({ dataset, subject: 0, object: 1 })

      path.append(edge)

      expect(path.dataset).toBe(dataset)
    })

    it('should throw an error if the edge is from a different dataset', () => {
      const path = createPath()
      const dataset = rdf.dataset()
      const edge = createEdge({ dataset, subject: 0, object: 1 })

      expect(() => {
        path.append(edge)
      }).toThrow()
    })
  })
})
