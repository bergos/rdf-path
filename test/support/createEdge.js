const dataModelFactory = require('@rdfjs/data-model')
const Edge = require('../../Edge')

function createEdge ({ path, dataset, subject, predicate, object, dir = 'out' }) {
  if (typeof subject !== 'object') {
    subject = dataModelFactory.namedNode(`http://example.org/${subject}`)
  }

  if (typeof predicate !== 'object') {
    predicate = dataModelFactory.namedNode(`http://example.org/${predicate || dir}`)
  }

  if (typeof object !== 'object') {
    object = dataModelFactory.namedNode(`http://example.org/${object}`)
  }

  const quad = dataModelFactory.quad(subject, predicate, object)

  dataset = ((path && path.dataset) || dataset)
  dataset.add(quad)

  return new Edge({ dataset, quad, dir })
}

module.exports = createEdge
