const createEdge = require('./createEdge')
const datasetFactory = require('@rdfjs/dataset')
const Path = require('../../Path')

function createPath ({ length = 0 } = {}) {
  const path = new Path({ dataset: datasetFactory.dataset() })

  for (let index = 0; index < length; index++) {
    path.edges.push(createEdge({ path, subject: index, object: index + 1 }))
  }

  return path
}

module.exports = createPath
