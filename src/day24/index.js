const fs = require('fs');

// Using cube coordinates to represent hexagonal tiles:
// https://www.redblobgames.com/grids/hexagons/#coordinates-cube
module.exports = function(inputFile) {
  const directions = parseFile(inputFile)

  const coordinates = directions.map(directionsToCoordinates);

  const floor = new Floor(coordinates);
  const firstDayBlackTiles = floor.blackTiles();

  const evaluation = (tile, neighbors) => {
    const blackNeighbors = neighbors.filter(x => x).length;

    if (tile && blackNeighbors == 0) return false;
    if (tile && blackNeighbors > 2) return false;
    if (!tile && blackNeighbors == 2) return true;
    return tile;
  }

  for (let i = 1; i <= 100; i++) {
    floor.iterate(evaluation);
  }

  console.log('Number of black tiles the first day:', firstDayBlackTiles);
  console.log('Number of black tiles the 100th day:', floor.blackTiles());
};

class Floor {
  constructor(coordinates) {
    this.tiles = {};
    this.dimensions = 3;
    coordinates.forEach(c => this.tiles[`${c.x}.${c.y}.${c.z}`] = ! this.tiles[`${c.x}.${c.y}.${c.z}`]);
  }

  iterate(evaluator) {
    // Initialize neighbors
    Object.keys(this.tiles).forEach((key) => this.exploreNeighbors(key));
    // Deep copy or can't change simultaneously
    const nextTiles = { ...this.tiles };

    Object.keys(this.tiles).forEach((key) => {
      const neighbors = this.getNeighborKeys(key).map(n => this.tiles[n]);

      nextTiles[key] = evaluator(this.tiles[key], neighbors);
    });

    this.tiles = nextTiles;
  }

  blackTiles() {
    return Object.values(this.tiles).filter(c => c).length;
  }

  getNeighborKeys(key) {
    const coords = key.split('.').map(k => parseInt(k));

    const transformations = [
      { x: +0, y: +1, z: -1 },
      { x: +1, y: +0, z: -1 },
      { x: +1, y: -1, z: +0 },
      { x: +0, y: -1, z: +1 },
      { x: -1, y: +0, z: +1 },
      { x: -1, y: +1, z: +0 },
    ];

    return transformations.map(t => `${coords[0] + t.x}.${coords[1] + t.y}.${coords[2] + t.z}`);
  }

  exploreNeighbors(key) {
    this.getNeighborKeys(key).forEach(key => {
      this.tiles[key] = !! this.tiles[key];
    });
  }
}

function directionsToCoordinates(directions) {
  const coordinates = { x: 0, y: 0, z: 0};

  directions.forEach(direction => {
    switch(direction) {
      case 'e':
        coordinates.x++;
        coordinates.y--;
        break;
      case 'w':
        coordinates.x--;
        coordinates.y++;
        break;
      case 'ne':
        coordinates.x++;
        coordinates.z--;
        break;
      case 'nw':
        coordinates.y++;
        coordinates.z--;
        break;
      case 'se':
        coordinates.y--;
        coordinates.z++;
        break;
      case 'sw':
        coordinates.x--;
        coordinates.z++;
        break;
    }

  });

  return coordinates;
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l != '').map(line => {
      const array = line.split('');
      const directions = [];

      while (array.length > 0) {
        const toRemove = (array[0] == 'e' || array[0] == 'w') ? 1 : 2;
        directions.push(array.splice(0, toRemove).join(''))
      }
      return directions;
    });
}
