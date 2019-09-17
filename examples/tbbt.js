const fs = require('fs')
const namespace = require('@rdfjs/namespace')
const N3Parser = require('@rdfjs/parser-n3')
const { fromStream } = require('rdf-dataset-ext')
const rdf = require('rdf-ext')
const Node = require('../Node')
const shortest = require('../shortest')
const TermSet = require('@rdfjs/term-set')

const ns = {
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('http://schema.org/'),
  tbbt: namespace('http://localhost:8080/data/')
}

// import the dataset from the tbbt-ld package
async function importDataset () {
  const input = fs.createReadStream(require.resolve('tbbt-ld/dist/tbbt.nt'))
  const parser = new N3Parser()

  return fromStream(rdf.dataset(), parser.import(input))
}

async function main () {
  const dataset = await importDataset()

  // first node is the person Mary Cooper
  const maryCooper = new Node({ dataset, term: ns.tbbt('person/mary-cooper') })

  // second node is the literal "comic book store owner"
  const comicBookStoreOwner = new Node({ dataset, term: rdf.literal('comic book store owner') })

  // let's see if we find a connection between both nodes
  const path = shortest(maryCooper, comicBookStoreOwner, {
    blacklist: new TermSet([ns.rdf.type]), // disable rdf.type so we don't end up in the link Person -> Person
    followLiterals: true // follow literals, as our end node is a literal, we can be sure we need literal links
  })

  if (path) {
    // if a path was found, write the chain of nodes to the console
    console.log(path.toString())
  } else {
    console.log('no path found')
  }
}

main()
