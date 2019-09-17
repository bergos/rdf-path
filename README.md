# rdf-path

This package provides classes and utils to describe paths in RDF graphs based on the [RDF/JS Data Model](http://rdf.js.org/data-model-spec/) and [RDF/JS Dataset](https://rdf.js.org/dataset-spec/).

## Interfaces

### Node

A Node represents a term inside a dataset in a specific named graph.
The constructor accepts `dataset`, `graph` and `term` as named parameters which will be assigned to the properties with the same name.
The parameters must be provided just like in the following description. 

Properties:
- `dataset`: The dataset that contains the term as a RDF/JS `DatasetCore` object.
- `graph`: The named graph that contains the term as a RDF/JS `NamedNode` object.
- `term`: The term as a RDF/JS `Term` object.

Methods:
- `equals(other)`: Compares this Node with `other` using `equals` for each property.

### Edge

An Edge represents a connection from one Node to another with a specific predicate in a specific direction.
A `dataset`, `dir` and `quad` is used to store that information.
The same parameters are required by the constructor.
The parameters must be provided just like in the following description.

Properties:
- `dataset`: The dataset that contains the quad as a RDF/JS `DatasetCore` object.
- `dir`: The direction of the connection which can be `out` for `subject` -> `object` or `in` for `object` -> `subject`.
- `quad`: The quad that contains the connection information as RDF/JS `Quad`.
- `start`: The start `Node` of the edge.
- `end`: The end `Node` of the edge.

Methods:
- `equals(other)`: Compares this Edge with `other` using string compare for `dir` property and `equals` for the `dataset` and `quad` properties.

### Path

A Path represents a chain of Edges connected to each other.
A `dataset` and an array of `edges` are used to store that information.
The `dataset` parameter can be given in the constructor.
If the parameter is not given, it will be assigned when the first Edge is appended.

Properties:
- `dataset`: The dataset that contains the edges as a RDF/JS `DatasetCore` object.
- `edges`: The edges as an array of `Edge`.
- `length`: The number of edges in the path.
- `out`: True if there is an Edge in the Path with the direction `out`.
- `in`: True if there is an Edge in the Path with the direction `in`.
- `start`: The first Node of the Path.
- `end`: The last Node of the Path.

Methods:
- `toString()`: Returns the terms of the Nodes separated by comma as a string.
- `clone()`: Returns a new Path object with the same `dataset` and a copy of the `edges` array.
- `node(index)`: Returns the Node with the given index, start counting from `start`.
- `append(edge)`: Appends an Edge to the Path.
  Returns the Path itself.

## Functions

### neighbors(node, options)

Searches for all neighbors of the given `node` and returns them as a `Set` of `Edges` from `node` to the neighbor.
The search behavior can be configured using the following options:

- `blacklist`: A blacklist for the predicates of the edges given as a [TermSet](https://github.com/rdfjs-base/term-set) of RDF/JS `Term`.  
- `dirIn`: Boolean value to enable the search in the direction `object` -> `subject`.
  The default value is `false` (disabled).
- `dirOut`: Boolean value to enable the search in the direction `subject` -> `object`.
  The default value is `true` (enabled).
- `followLiterals`: Boolean value to enable the search for literal objects.
  The default value is `false` (disabled).
- `whitelist`: A whitelist for the predicates of the edges given as a [TermSet](https://github.com/rdfjs-base/term-set) of RDF/JS `Term`. 

### shortest (start, end, options)

Searches for the shortest path between `start` and `end` and returns it as `Path` object.
If no path was found `null` is returned.
The search behavior can be configured using the following options:

- `blacklist`: A blacklist for the predicates of the edges given as a [TermSet](https://github.com/rdfjs-base/term-set) of RDF/JS `Term`.  
- `cutoff`: Stop searching for more edges if the path has already `cutoff` number of edges.
  The default value is `Number.MAX_SAFE_INTEGER`.
- `dirIn`: Boolean value to enable the search in the direction `object` -> `subject`.
  The default value is `false` (disabled).
- `dirOut`: Boolean value to enable the search in the direction `subject` -> `object`.
  The default value is `true` (enabled).
- `followLiterals`: Boolean value to enable the search for literal objects.
  The default value is `false` (disabled).
- `whitelist`: A whitelist for the predicates of the edges given as a [TermSet](https://github.com/rdfjs-base/term-set) of RDF/JS `Term`. 

## Usage

All classes and functions can be imported directly from the file matching the class or function name in the root directory.
The code below shows how `Node` and `shortest` are imported.

```js
// import the RDF/JS data model to create NamedNode objects
const rdf = {...require('@rdfjs/data-model'), ...require('@rdfjs/dataset')}

// each class and function of the rdf-path package can be imported separated using the path
const Node = require('rdf-path/Node')
const shortest = require('rdf-path/shortest')

// this will just create the dataset, it must be also populated (not included in this example)
const dataset = rdf.dataset()
 
// create the start and end node
const start = new Node({ dataset, term: rdf.namedNode('http://example.org/start') })
const end = new Node({ dataset, term: rdf.namedNode('http://example.org/end') })

// search for the shortest path between start and end
const path = shortest(start, end)

// write the chain of nodes to the console
console.log(path.toString())
```

It's also possible to import the classes and functions from the root object exported by the package.
For the `Node` class that would look like this:

```js
const { Node } = require('rdf-path')
```

## Examples

The examples folder contains an example based on the (The Big Bang Theory dataset)[https://github.com/zazuko/tbbt-ld].
It shows how to search for the shortest path between a named node and a literal.
