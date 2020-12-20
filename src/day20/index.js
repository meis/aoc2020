const fs = require('fs');

module.exports = function(inputFile) {
  const tiles = parseFile(inputFile).map(t => new Tile(t));

  // tiles.forEach(tile => tile.borders = getBorders(tile));
  // tiles.forEach(tile => tile.neighbors = getNeighbors(tiles, tile));
  // console.log(tiles.map(t => t.neighbors))

  // const borders = tiles.filter(t => t.neighbors.length === 2);
  // const multiplyBorderIds = borders.map(b => b.id).reduce((a, b) => a * b, 1);

  // console.log(multiplyBorderIds)

  const neighborMap = {}
  tiles.forEach(tile => neighborMap[tile.id] = tile.getNeighborIds(tiles))

  
  const multiplyBorderIds = Object.keys(neighborMap)
  .filter(k => neighborMap[k].length == 2)
  .reduce((a, b) => a * b, 1);
  
  console.log(multiplyBorderIds)
  
  console.log(neighborMap)
  console.log(tiles.length)
  const dimensions = Math.sqrt(tiles.length);
  const sortedTiles = Array.from(Array(dimensions).map(_ => Array.from(Array(tdimensions))));
  const topLeft = Object.keys(neighborMap).filter(k => neighborMap[k].length == 2)[0];

  let current = tiles.filter(t => t.id == topLeft)[0];
  sortedTiles[0, 0] = current.id;
  for (let i = 1; i < dimensions; i++) {
    current = findRightNeighbor(current, neighborMap[current.id].map(c => tiles.filter(t => t.id === c)[0]));
    sortedTiles[0, i] = current.id;
  }
  console.log(sortedTiles)
};

function findRightNeighbor(tile, candidates) {
  let right;
  candidates.forEach(candidate => {
    if (tile.rightBorder() === candidate.leftBorder()) {
      right = candidate;
      return;
    }
    candidate.rotate();
    if (tile.rightBorder() === candidate.leftBorder()) {
      right = candidate;
      return;
    }
    candidate.rotate();
    if (tile.rightBorder() === candidate.leftBorder()) {
      right = candidate;
      return;
    }
    candidate.rotate();
    if (tile.rightBorder() === candidate.leftBorder()) {
      right = candidate;
      return;
    }
  });
  return right;
}

class Tile {
  constructor({id, bitmap}) {
    this.id = id;
    this.bitmap = bitmap;
  }

  rotate() {
    const dimension = this.bitmap.length;
    const newBitmap = Array.from(Array(dimension)).map(_ => Array.from(Array(dimension)));

    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j ++) {
        newBitmap[i][j] = this.bitmap[dimension - j - 1][i];
      }
    }

    this.bitmap = newBitmap;
  }

  getNeighborIds(tiles) {
    return tiles.filter(t => t.id !== this.id).filter(t => this.sharesBorderWith(t)).map(t => t.id);
  }

  sharesBorderWith(otherTile) {
    const myBorders = this.allPossibleBorders();
    const otherBorders = otherTile.allPossibleBorders();

    return myBorders.filter(b => otherBorders.includes(b)).length > 0;
  }

  allPossibleBorders() {
    return [
      this.topBorder(),
      this.bottomBorder(),
      this.leftBorder(),
      this.rightBorder(),
    ]
    .map(b => [b, b.split('').reverse().join('')])
    .flat();
  }

  topBorder() {
    return this.bitmap[0].join('');
  }

  bottomBorder() {
    return this.bitmap[this.bitmap.length -1].join('');
  }

  leftBorder() {
    return this.bitmap.map(row => row[0]).join('');
  }

  rightBorder() {
    return this.bitmap.map(row => row[row.length - 1]).join('');
  }

  print() {
    return this.bitmap.map(col => col.join('')).join("\n");
  }
}

function parseFile(file) {
  const pieces = fs.readFileSync(file)
    .toString()
    .split("\n\n")
    .filter(l => l != '');

  return pieces.map((piece) => {
    let lines = piece.split("\n");
    const header = lines.shift();
    const id = parseInt(header.split(' ')[1].split(':')[0]);
    const bitmap = lines.map(l => l.split(''));
    return { id, bitmap }
  });
}
