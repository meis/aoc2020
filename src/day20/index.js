const fs = require('fs');

module.exports = function(inputFile) {
  const tiles = parseFile(inputFile).map(t => new Tile(t));

  const neighborMap = {}
  tiles.forEach(tile => neighborMap[tile.id] = tile.getNeighborIds(tiles))


  tiles.forEach(tile => tile.addNeighbors(tiles))


  const multiplyBorderIds = Object.keys(neighborMap)
  .filter(k => neighborMap[k].length == 2)
  .reduce((a, b) => a * b, 1);




  const dimensions = Math.sqrt(tiles.length);
  const sortedTiles = Array.from(Array(dimensions)).map(_ => Array.from(Array(dimensions)));


  let candidates = [tiles.find(t => t.neighbors.length === 2)];
  for (let i = 0; i < dimensions; i++) {
    for (let j = 0; j < dimensions; j++) {
      candidates.forEach(t => fit(i, j, t, sortedTiles));
      if (j === dimensions -1) {
        candidates = sortedTiles[i][0].neighbors.filter(t => !t.fit);
      }
      else {
        candidates = sortedTiles[i][j].neighbors.filter(t => !t.fit);
      }
    }
  }

  console.log(sortedTiles.map(row => row.map(col => col ? col.id : null)))

};

function fit(i, j, tile, sortedTiles) {
  if (tile.shakeUntil(() => checkRules(i, j, tile, sortedTiles))) {
    tile.fit = true;
    sortedTiles[i][j] = tile;
  }
}

function checkRules(i, j, tile, sortedTiles) {
  const rules = [
    { myMethod: 'topBorder', theirMethod: 'bottomBorder', neighbors: i === 0 ? null : sortedTiles[i - 1][j] },
    { myMethod: 'bottomBorder', theirMethod: 'topBorder', neighbors: i === sortedTiles.length -1 ? null : tile.neighbors },
    { myMethod: 'leftBorder', theirMethod: 'rightBorder', neighbors: j === 0 ? null : sortedTiles[i][j - 1] },
    { myMethod: 'rightBorder', theirMethod: 'leftBorder', neighbors: j === sortedTiles.length -1 ? null : tile.neighbors },
  ];

  return rules.map(rule => {
    if (rule.neighbors === null) {
      const neighborBorders = tile.neighbors.map(n => n.allPossibleBorders()).flat();
      return ! neighborBorders.includes(tile[rule.myMethod]());
    } else if (Array.isArray(rule.neighbors)) {
      const neighborBorders = rule.neighbors.map(n => n.allPossibleBorders()).flat();
      return neighborBorders.includes(tile[rule.myMethod]());
    } else {
      return rule.neighbors[rule.theirMethod]() === tile[rule.myMethod]();
    }
  }).every(result => result === true);
}


class Tile {
  constructor({id, bitmap}) {
    this.id = id;
    this.bitmap = bitmap;
    this.dimension = this.bitmap.length;
    this.fit = false;
  }

  rotate() {
    this.transform((i, j) => this.bitmap[this.dimension - j - 1][i]);
  }

  flipVertically() {
    this.transform((i, j) => this.bitmap[this.dimension - i - 1][j]);
  }

  flipHorizontally() {
    this.transform((i, j) => this.bitmap[i][this.dimension - j - 1]);
  }

  shakeUntil(condition) {
    const movements = [
      'flipVertically', 'flipHorizontally', 'flipVertically', 'flipHorizontally', 'rotate',
      'flipVertically', 'flipHorizontally', 'flipVertically', 'flipHorizontally', 'rotate',
      'flipVertically', 'flipHorizontally', 'flipVertically', 'flipHorizontally', 'rotate',
      'flipVertically', 'flipHorizontally', 'flipVertically', 'flipHorizontally', 'rotate',
    ]
    for (let i = 0; i < movements.length; i++) {
      if (condition(this)) return true;
      this[movements[i]]();
    }
    return false;
  }

  transform(transformation) {
    if (this.fit) throw new Error("Can't move a tile that already fits")
    const newBitmap = Array.from(Array(this.dimension)).map(_ => Array.from(Array(this.dimension)));

    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j ++) {
        newBitmap[i][j] = transformation(i, j);
      }
    }

    this.bitmap = newBitmap;
  }

  getNeighborIds(tiles) {
    return tiles.filter(t => t.id !== this.id).filter(t => this.sharesBorderWith(t)).map(t => t.id);
  }

  addNeighbors(tiles) {
    this.neighbors = tiles.filter(t => t.id !== this.id).filter(t => this.sharesBorderWith(t));
  }

  sharesBorderWith(otherTile) {
    const myBorders = this.allPossibleBorders();
    const otherBorders = otherTile.allPossibleBorders();

    return myBorders.filter(b => otherBorders.includes(b)).length > 0;
  }

  allPossibleBorders() {
    return ['topBorder', 'bottomBorder', 'leftBorder', 'rightBorder']
      .map(b => this[b]())
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
