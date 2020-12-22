const fs = require('fs');

module.exports = function(inputFile) {
  const tiles = parseFile(inputFile).map(t => new Tile(t));

  // tiles.forEach(tile => tile.borders = getBorders(tile));
  // tiles.forEach(tile => tile.neighbors = getNeighbors(tiles, tile));
  // console.log(tiles.map(t => t.neighbors))

  // const borders = tiles.filter(t => t.neighbors.length === 2);
  // const multiplyBorderIds = borders.map(b => b.id).reduce((a, b) => a * b, 1);

  // console.log(multiplyBorderIds)

  //console.log(tiles[0].allPossibleBorders().sort())

  const neighborMap = {}
  tiles.forEach(tile => neighborMap[tile.id] = tile.getNeighborIds(tiles))


  const multiplyBorderIds = Object.keys(neighborMap)
  .filter(k => neighborMap[k].length == 2)
  .reduce((a, b) => a * b, 1);

  //const t = new Tile({ id: 1, bitmap: [[ 1, 2, 3], [4, 5, 6], [7, 8, 9]] });
  // t.shakeUntil(() => t.bitmap[1][0] == 2)
  // console.log(t.print(), "\n")
  // t.flipVertically();
  // console.log(t.print(), "\n")
  // t.flipHorizontally();
  // console.log(t.print(), "\n")
  // t.rotate();
  // console.log(t.print(), "\n")



  // t1 = tiles.filter(t => t.id == 1951)[0];
  // console.log(t1.print(), "\n")
  // t2 = tiles.filter(t => t.id == 2311)[0];
  // t3 = tiles.filter(t => t.id == 2729)[0];
  // getInitialTile(t1, [t2, t3], neighborMap)
  // const x = findRightNeighbor(t1, tiles);
  // console.log({ x})
  // console.log(findRightNeighbor(x, tiles))


  const dimensions = Math.sqrt(tiles.length);
  const sortedTiles = Array.from(Array(dimensions)).map(_ => Array.from(Array(dimensions)));


  let corners = Object.keys(neighborMap).filter(k => neighborMap[k].length == 2).map(id => tiles.filter(t => t.id == id)[0]);
  let finished = false;
  while(!finished && corners.length > 1) {
    let current = getInitialTile(corners.shift(), tiles, neighborMap)
    //try {
      for(let i = 0; i < dimensions; i++) {
        console.log({ current })
        sortedTiles[i][0] = current.id;

        for (let j = 1; j < dimensions; j++) {
          //current = findRightNeighbor(current, tiles);
          current = findRightNeighbor(current, neighborMap[current.id].map(c => tiles.filter(t => t.id === c)[0]));
          sortedTiles[i][j] = current.id;
        }

        if (i < dimensions - 1) {
          const left = tiles.filter(t => t.id === sortedTiles[i][0])[0];
          console.log(left)
          current = findBottomNeighbor(left, tiles)
        }
      }

      finished = true;
    //} catch(e) {
    //  console.log(e)
    //}
  }
  console.log(sortedTiles)
};

function getInitialTile(initial, tiles, neighborMap) {
  const [a, b] = neighborMap[initial.id].map(c => tiles.filter(t => t.id === c)[0]);

  initial.shakeUntil(() => {
    return [...a.allPossibleBorders(), ...b.allPossibleBorders()].includes(initial.rightBorder()) &&
    [...a.allPossibleBorders(), ...b.allPossibleBorders()].includes(initial.bottomBorder());
  });
  return initial;
}

function findRightNeighbor(tile, candidates) {
  let right;
  console.log(tile.id, { candidates })
  candidates.filter(c => c.id !== tile.id).forEach(candidate => {
    console.log(`trying`, candidate.id)
    if (candidate.shakeUntil(() => tile.rightBorder() === candidate.leftBorder())) {
      right = candidate;
    }
    // if (tile.rightBorder() === candidate.leftBorder()) {
    //   right = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.rightBorder() === candidate.leftBorder()) {
    //   right = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.rightBorder() === candidate.leftBorder()) {
    //   right = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.rightBorder() === candidate.leftBorder()) {
    //   right = candidate;
    //   return;
    // }
  });
  return right;
}

function findBottomNeighbor(tile, candidates) {
  let bottom;
  candidates.filter(c => c.id !== tile.id).forEach(candidate => {
    if (candidate.shakeUntil(() => tile.bottomBorder() === candidate.topBorder())) {
      bottom = candidate;
    }
    // if (tile.bottomBorder() === candidate.topBorder()) {
    //   bottom = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.bottomBorder() === candidate.topBorder()) {
    //   bottom = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.bottomBorder() === candidate.topBorder()) {
    //   bottom = candidate;
    //   return;
    // }
    // candidate.rotate();
    // if (tile.bottomBorder() === candidate.topBorder()) {
    //   bottom = candidate;
    //   return;
    // }
  });
  return bottom;
}

class Tile {
  constructor({id, bitmap}) {
    this.id = id;
    this.bitmap = bitmap;
    this.dimension = this.bitmap.length;
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
    if (condition(this)) return true;
    this.rotate()
    if (condition(this)) return true;
    this.rotate()
    if (condition(this)) return true;
    this.rotate()
    if (condition(this)) return true;
    this.rotate()
    this.flipVertically()
    if (condition(this)) return true;
    this.flipHorizontally()
    if (condition(this)) return true;
    this.flipVertically()
    if (condition(this)) return true;
    this.flipHorizontally()
    return false;
  }

  transform(transformation) {
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

  sharesBorderWith(otherTile) {
    const myBorders = this.allPossibleBorders();
    const otherBorders = otherTile.allPossibleBorders();

    return myBorders.filter(b => otherBorders.includes(b)).length > 0;
  }

  allPossibleBorders() {
    // const all = [];
    // all.push(this.topBorder(), this.bottomBorder(), this.leftBorder(), this.rightBorder());
    // this.rotate();
    // all.push(this.topBorder(), this.bottomBorder(), this.leftBorder(), this.rightBorder());
    // this.rotate();
    // all.push(this.topBorder(), this.bottomBorder(), this.leftBorder(), this.rightBorder());
    // this.rotate();
    // all.push(this.topBorder(), this.bottomBorder(), this.leftBorder(), this.rightBorder());

    // return all;

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
