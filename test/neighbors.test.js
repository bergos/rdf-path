/* global describe, it, expect */

const createEdge = require('./support/createEdge')
const createPath = require('./support/createPath')
const dataModelFactory = require('@rdfjs/data-model')
const Edge = require('../Edge')
const neighbors = require('../neighbors')
const TermSet = require('@rdfjs/term-set')

describe('neighbors', () => {
  it('should be a function', () => {
    expect(typeof neighbors).toBe('function')
  })

  it('should return a Set of Edges', () => {
    const path = createPath({ length: 2 })

    const result = neighbors(path.node(1))

    expect(result instanceof Set).toBe(true)
    expect([...result][0] instanceof Edge).toBe(true)
  })

  it('should find neighbors in dir out by default', () => {
    const path = createPath({ length: 2 })

    const result = neighbors(path.node(1))

    expect([...result][0].end.equals(path.end)).toBe(true)
  })

  it('should find neighbors in dir in when only dirIn is true', () => {
    const path = createPath({ length: 2 })

    const result = neighbors(path.node(1), { dirIn: true, dirOut: false })

    expect([...result][0].end.equals(path.start)).toBe(true)
  })

  it('should not follow literals by default', () => {
    const path = createPath({ length: 1 })
    createEdge({ path, subject: 1, object: dataModelFactory.literal('test') })

    const result = neighbors(path.node(1))

    expect(result.size).toBe(0)
  })

  it('should follow literals if followLiterals is true', () => {
    const path = createPath({ length: 1 })
    path.append(createEdge({ path, subject: 1, object: dataModelFactory.literal('test') }))

    const result = neighbors(path.node(1), { followLiterals: true })

    expect(result.size).toBe(1)
    expect([...result][0].end.equals(path.end)).toBe(true)
  })

  it('should exclude edges with predicates matching the blacklist', () => {
    const path = createPath()
    const pass = createEdge({ path, subject: 0, predicate: 'pass', object: 1 })
    const block = createEdge({ path, subject: 0, predicate: 'block', object: 2 })
    const blacklist = new TermSet([block.quad.predicate])

    const result = neighbors(pass.start, { blacklist })

    expect(result.size).toBe(1)
    expect([...result][0].end.equals(pass.end)).toBe(true)
  })

  it('should exclude edges with predicates matching the blacklist on dir in', () => {
    const path = createPath()
    const pass = createEdge({ path, subject: 1, predicate: 'pass', object: 0, dir: 'in' })
    const block = createEdge({ path, subject: 2, predicate: 'block', object: 0, dir: 'in' })
    const blacklist = new TermSet([block.quad.predicate])

    const result = neighbors(pass.start, { blacklist, dirIn: true })

    expect(result.size).toBe(1)
    expect([...result][0].end.equals(pass.end)).toBe(true)
  })

  it('should only include edges with predicates matching the whitelist', () => {
    const path = createPath()
    const pass = createEdge({ path, subject: 0, predicate: 'pass', object: 1 })
    createEdge({ path, subject: 0, predicate: 'block', object: 2 })
    const whitelist = new TermSet([pass.quad.predicate])

    const result = neighbors(pass.start, { whitelist })

    expect(result.size).toBe(1)
    expect([...result][0].end.equals(pass.end)).toBe(true)
  })

  it('should only include edges with predicates matching the whitelist on dir in', () => {
    const path = createPath()
    const pass = createEdge({ path, subject: 1, predicate: 'pass', object: 0, dir: 'in' })
    createEdge({ path, subject: 2, predicate: 'block', object: 0, dir: 'in' })
    const whitelist = new TermSet([pass.quad.predicate])

    const result = neighbors(pass.start, { whitelist, dirIn: true })

    expect(result.size).toBe(1)
    expect([...result][0].end.equals(pass.end)).toBe(true)
  })

  it('should throw an error if blacklist and whitelist are given', () => {
    const path = createPath({ length: 2 })
    const blacklist = new TermSet()
    const whitelist = new TermSet()

    expect(() => {
      neighbors(path.node(1), { blacklist, whitelist })
    }).toThrow()
  })
})
