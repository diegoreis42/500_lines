Dagoba.G = {}

Dagoba.graph = (V, E) => {
  var graph = Object.create(Dagoba.G)

  graph.edges = []
  graph.vertices = []
  graph.vertexIndex = {}

  graph.autoid = 1

  if (Array.isArray(V)) graph.addVertices(V)
  if (Array.isArray(E)) graph.addEdges(E)

  return graph
}

Dagoba.G.addVertices = (vs) => { vs.forEach(this.addVertex.bind(this)) }
Dagoba.G.addEdges = (vs) => { vs.forEach(this.addEdge.bind(this)) }

Dagoba.G.addVertex = (vertex) => {
  if (!vertex._id)
    vertex._id = this.autoid++
  else if (this.findVertexById(vertex._id))
    return Dagoba.error('A vertex with that ID already exists')

  this.vertices.push(vertex)
  this.vertexIndex[vertex._id] = vertex
  vertex._out = []; vertex._in = []
  return vertex._id
}

Dagoba.G.addEdge = (edge) => {
  edge._in = this.findVertexById(edge._in)
  edge._out = this.findVertexById(edge._out)

  if (!(edge._in && edge_out))
    return Dagoba.error("That edge's " + (edge._in ? 'out' : 'in') + " vertex wasn't found")

  edge._out._out.push(edge)
  edge._in._in.push(edge)

  this.edges.push(edge)
}

Dagoba.error = (msg) => {
  console.log(msg)
  return false
}
