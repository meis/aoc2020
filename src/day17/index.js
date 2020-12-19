const fs = require('fs');

module.exports = function(inputFile) {
  const initialRegion = parseFile(inputFile)

  const universe3d = new Universe(initialRegion);
  Array.from(Array(6)).forEach(_ => universe3d.iterate());

  const universe4d = new Universe(initialRegion, 4);
  Array.from(Array(6)).forEach(_ => universe4d.iterate());

  console.log(
    'In the 3d universe, after a six-cycle boot process, the number of active cubes is:',
    universe3d.activeCubes(),
  );
  console.log(
    'In the 4d universe, after a six-cycle boot process, the number of active cubes is:',
    universe4d.activeCubes(),
  );
};

class Universe {
  constructor(initialRegion, dimensions = 3) {
    this.cubes = {};
    this.dimensions = dimensions;

    initialRegion.forEach((col, i) => {
      col.forEach((row, j) => {
          const key = `${i}.${j}.` + Array.from(Array(dimensions -2)).map(i => '0').join('.');
          this.cubes[key] = row;
      });
    });
  }

  iterate() {
    // Initialize neighbors
    Object.keys(this.cubes).forEach((key) => this.exploreNeighbors(key));
    // Deep copy or can't change simultaneously
    const nextCubes = { ...this.cubes };

    Object.keys(this.cubes).forEach((key) => {
      const cubeIsActive = this.cubes[key];
      const activeNeighbors = this.getActiveNeighbors(key);

      if (cubeIsActive && (activeNeighbors !== 3 && activeNeighbors !== 2)) {
        nextCubes[key] = false;
      }
      else if (!cubeIsActive && activeNeighbors === 3) {
        nextCubes[key] = true;
      }
    });

    this.cubes = nextCubes;
  }

  activeCubes() {
    return Object.values(this.cubes).filter(c => c).length;
  }

  getActiveNeighbors(key) {
    return this.getNeighborKeys(key).map(n => this.cubes[n]).filter(n => n).length;
  }

  getNeighborKeys(key) {
    const coords = key.split('.').map(k => parseInt(k));
    const neighborKeys = [];

    const digDimension = (dimension = 0, accumulatedKey = '') => {
      const currentCoord = coords[dimension];

      [currentCoord + 1, currentCoord, currentCoord - 1].forEach((n) => {
        if (dimension === this.dimensions - 1) {
          const finalKey = `${accumulatedKey}${n}`;
          if (finalKey !== key) neighborKeys.push(finalKey);
        }
        else {
          const partialKey = `${accumulatedKey}${n}.`;
          digDimension(dimension + 1, partialKey);
        }
      });
    };
    digDimension();

    return neighborKeys;
  }

  exploreNeighbors(key) {
    this.getNeighborKeys(key).forEach(key => {
      if (!this.cubes[key]) this.cubes[key] = false
    });
  }
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .map(row => row.split("").map(c => c === '#'));
}
