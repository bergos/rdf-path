/* global describe, it, expect */

const createEdge = require('./support/createEdge')
const createPath = require('./support/createPath')
const dataModelFactory = require('@rdfjs/data-model')
const Path = require('../Path')
const shortest = require('../shortest')
const TermSet = require('@rdfjs/term-set')

describe('shortest', () => {
  it('should be a function', () => {
    expect(typeof shortest).toBe('function')
  })

  it('should return a Path', () => {
    const path = createPath({ length: 2 })

    const result = shortest(path.start, path.end)

    expect(result instanceof Path).toBe(true)
  })

  it('should return null if no path was found', () => {
    const path = createPath()
    const edge0 = createEdge({ path, subject: 0, object: 1, dir: 'out' })
    const edge1 = createEdge({ path, subject: 2, object: 3, dir: 'out' })

    const result = shortest(edge0.start, edge1.end)

    expect(result).toBe(null)
  })

  it('should find path in dir out by default', () => {
    const path = createPath({ length: 3 })
    createEdge({ path, subject: 3, object: 0, dir: 'in' })

    const result = shortest(path.start, path.end)

    expect(result.length).toBe(3)
  })

  it('should find path in dir in when dirIn is true', () => {
    const path = createPath({ length: 3 })
    createEdge({ path, subject: 3, object: 0, dir: 'in' })

    const result = shortest(path.start, path.end, { dirIn: true })

    expect(result.length).toBe(1)
  })

  it('should not follow literals by default', () => {
    const path = createPath({ length: 3 })
    createEdge({ path, subject: 3, object: dataModelFactory.literal('test') })
    createEdge({ path, subject: 0, object: dataModelFactory.literal('test') })

    const result = shortest(path.start, path.end, { dirIn: true })

    expect(result.length).toBe(3)
  })

  it('should follow literals if followLiterals is true', () => {
    const path = createPath({ length: 3 })
    createEdge({ path, subject: 3, object: dataModelFactory.literal('test') })
    createEdge({ path, subject: 0, object: dataModelFactory.literal('test') })

    const result = shortest(path.start, path.end, { dirIn: true, followLiterals: true })

    expect(result.length).toBe(2)
  })

  it('should exclude edges with predicates matching the blacklist', () => {
    const path = createPath({ length: 3 })
    const pass = createEdge({ path, subject: 0, predicate: 'pass', object: 2 })
    path.append(pass)
    const block = createEdge({ path, subject: 0, predicate: 'block', object: 3 })
    path.append(block)
    const blacklist = new TermSet([block.quad.predicate])

    const result = shortest(path.start, path.end, { blacklist })

    expect(result.length).toBe(2)
    expect(result.edges[0].equals(pass)).toBe(true)
  })

  it('should only include edges with predicates matching the whitelist', () => {
    const path = createPath({ length: 1 })
    const pass0 = createEdge({ path, subject: 0, predicate: 'pass', object: 2 })
    path.append(pass0)
    const pass1 = createEdge({ path, subject: 2, predicate: 'pass', object: 1 })
    path.append(pass1)
    const whitelist = new TermSet([pass0.quad.predicate])

    const result = shortest(path.start, path.end, { whitelist })

    expect(result.length).toBe(2)
    expect(result.edges[0].equals(pass0)).toBe(true)
    expect(result.edges[1].equals(pass1)).toBe(true)
  })

  it('should throw an error if blacklist and whitelist are given', () => {
    const path = createPath({ length: 2 })
    const blacklist = new TermSet()
    const whitelist = new TermSet()

    expect(() => {
      shortest(path.start, path.end, { blacklist, whitelist })
    }).toThrow()
  })

  it('should stop searching if the number of edges is higher than cutoff', () => {
    const path = createPath({ length: 4 })

    const result = shortest(path.start, path.end, { cutoff: 3 })

    expect(result).toBe(null)
  })
})
