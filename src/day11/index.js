const fs = require('fs');

module.exports = function(inputFile) {
  let seats = parseFile(inputFile);

  const situation1 = iterateSeats(personalAlgorithm1, seats)
  const situation2 = iterateSeats(personalAlgorithm2, seats)

  console.log(
    `Number of ocuppied seats using the first method: ${occupiedSeats(situation1)}`,
  );
  console.log(
    `Number of ocuppied seats using the second method: ${occupiedSeats(situation2)}`,
  );
};

function occupiedSeats(seats) {
  return seats.flat().filter(s => s === '#').length;
}

const DIRECTIONS = [
  [-1, -1], [-1, +0], [-1, +1],
  [+0, -1],           [+0, +1],
  [+1, -1], [+1, +0], [+1, +1],
];

function iterateSeats(personalAlgorithm, seats) {
  let stale = false;

  while (!stale) {
    let someChange = false;
    // Deep clone
    let nextSeats = JSON.parse(JSON.stringify(seats));

    for (let i = 0; i < seats.length; i++) {
      for (let j = 0; j < seats[i].length; j ++) {
        const current = seats[i][j];
        const next = personalAlgorithm(seats, i, j);
        nextSeats[i][j] = next;
        if (current !== next) {
          someChange = true;
        }
      }
    }

    seats = nextSeats;
    stale = !someChange;
  }

  return seats;
}

function personalAlgorithm1(seats, i, j) {
  const seat = seats[i][j];
  // Floor (.) never changes; seats don't move, and nobody sits on the floor.
  if (seat === '.') return '.';
  const adjacents = adjacentSeats(seats, i, j);
  // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
  if ((seat === 'L') && !adjacents.some(s => s === '#')) return '#';
  // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
  if ((seat === '#') && adjacents.filter(s => s === '#').length >= 4) return 'L';
  return seat;
}

function personalAlgorithm2(seats, i, j) {
  const seat = seats[i][j];
  // Floor (.) never changes; seats don't move, and nobody sits on the floor.
  if (seat === '.') return '.';
  const visibles = visibleSeats(seats, i, j);
  // If a seat is empty (L) and there are no occupied seats visible from it, the seat becomes occupied.
  if ((seat === 'L') && !visibles.some(s => s === '#')) return '#';
  // If a seat is occupied (#) and five or more seats visible from it are also occupied, the seat becomes empty.
  if ((seat === '#') && visibles.filter(s => s === '#').length >= 5) return 'L';
  return seat;
}

function adjacentSeats(seats, i, j) {
  return DIRECTIONS.map(([xDiff, yDiff]) => {
    const x = i + xDiff;
    const y = j + yDiff;
    return outOfBounds(seats, x, y) ? null : seats[x][y];
  }).filter(a => a);
}

function visibleSeats(seats, i, j) {
  const iterateDirection = (seats, i, j, xDiff, yDiff) => {
    const x = i + xDiff;
    const y = j + yDiff;
    if (outOfBounds(seats, x, y)) return null;
    const current = seats[x][y];
    return (current === '.') ? iterateDirection(seats, x, y, xDiff, yDiff) : current;
  }

  return DIRECTIONS.map(([xDiff, yDiff]) => iterateDirection(seats, i, j, xDiff, yDiff)).filter(a => a);
}

function outOfBounds(seats, x, y) {
  if (x < 0) return true;
  if (y < 0) return true;
  if (x >= seats.length) return true;
  if (y >= seats[0].length) return true;
  return false;
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(row => row.split(""));
}
