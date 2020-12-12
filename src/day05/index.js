const fs = require('fs');

module.exports = function(inputFile) {
  let highestSeatID = 0;
  let occupiedSeats = []

  fs.readFileSync(inputFile).toString().split(/\n/).forEach(line => {
    const seat = parseSeat(line);

    if (seat.ID > highestSeatID) {
      highestSeatID = seat.ID;
    }

    occupiedSeats[seat.ID] = seat;
  });

  // It's a completely full flight, so your seat should be the only missing boarding pass in your list.
  // However, there's a catch: some of the seats at the very front and back of the plane don't exist on
  // this aircraft, so they'll be missing from your list as well.
  // Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from yours will
  // be in your list.
  let mySeatID;
  let index = 1;
  while (!mySeatID && index < highestSeatID) {
    const current = occupiedSeats[index];
    const previous = occupiedSeats[index - 1];
    const next = occupiedSeats[index + 1];

    if (!current && previous && next) {
      mySeatID = index;
    }

    index++;
  }

  console.log(`The highest seat ID is ${highestSeatID}.`);
  console.log(`My seat ID is ${mySeatID}.`);
}

function parseSeat(line) {
  const bits = line.split('').map(c => c == 'B' || c == 'R');
  const row = parseSpacePartition(bits.slice(0, -3));
  const col = parseSpacePartition(bits.slice(7));

  return { col, row, ID: row * 8 + col };
};

function parseSpacePartition(bits) {
  let max = (2 ** bits.length);
  let min = 0;

  bits.forEach((b) => {
    const middle = (max + min) / 2;
    if (b) {
      min = middle;
    }
    else {
      max = middle;
    }
  });

  return max - 1;
};
