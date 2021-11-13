// return path between two address
const getPath = (source, target, previous) => {
  const path = [];
  let current = target;
  while (current !== source) {
    path.push(current);
    current = previous[current];
  }
  path.push(source);
  return path.reverse();
};


// Dijkstra’s algorithm to optimize route between two address
const routeOptimization = (graph, source) => {
  const nodes = new Set(Object.keys(graph));
  const distances = {};
  const previous = {};
  let smallest;

  nodes.forEach((node) => {
    distances[node] = Infinity;
  });

  distances[source] = 0;

  while (nodes.size > 0) {
    smallest = null;

    for (let node of nodes) {
      if (smallest === null || distances[node] < distances[smallest]) {
        smallest = node;
      }
    }

    if (smallest === null) {
      break;
    }

    nodes.delete(smallest);

    for (let neighbor in graph[smallest]) {
      let alt = distances[smallest] + graph[smallest][neighbor];

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = smallest;
      }
    }
  }

  return { distances, previous };
};

const RouteAlgo = (AddressObject) => {
  // second argument is source or starting point of route
  const { distances, previous } = routeOptimization(AddressObject, process.env.ADMIN_ADDRESS);

  // sort distances object descending order
  const addressKey = Object.keys(distances).sort(function(a, b){ return distances[b] - distances[a]; });

  // path from  starting point to the address where address is the most farthest from starting point.
  const path = getPath(process.env.ADMIN_ADDRESS, addressKey[0], previous);
  
  return path;

}

module.exports = RouteAlgo;

