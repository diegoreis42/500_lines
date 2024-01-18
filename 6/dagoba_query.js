Dagoba.Q = {}

Dagoba.query = (graph) => {
  var query = Object.create(Dagoba.Q)

  query.graph = graph
  query.state = []
  query.program = []
  query.gremlins = []

  return query
}

Dagoba.Q.add = (pipetype, args) => {
  var step = [pipetype, args]
  this.program.push(step)
  return this
}

Dagoba.G.v = () => {
  var query = Dagaba.query(this)
  query.add('vertex', [].slice.call(arguments))
  return query
}
