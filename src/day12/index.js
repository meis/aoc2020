const fs = require('fs');

module.exports = function (inputFile) {
  let instructions = parseFile(inputFile);

  const ferry1 = new SimpleFerry();
  instructions.forEach(i => ferry1.act(i));

  const ferry2 = new FerryWithWaypoint();
  instructions.forEach(i => ferry2.act(i));

  console.log(
    'The Manhattan distance for the simple ferry is:',
    ferry1.manhattanDistance(),
  );
  console.log(
    'The Manhattan distance for the waypoint ferry is:',
    ferry2.manhattanDistance(),
  );
};

const DIRECTIONS = {
  N: { x: +1, y: +0 },
  E: { x: +0, y: +1 },
  S: { x: -1, y: +0 },
  W: { x: +0, y: -1 },
};

function rotate90Left(initial, around = { x: 0, y: 0 }) {
  return {
    x: around.x + (initial.y - around.y),
    y: around.y - (initial.x - around.x),
  };
}

function rotate90Right(initial, around = { x: 0, y: 0 }) {
  return {
    x: around.x - (initial.y - around.y),
    y: around.y + (initial.x - around.x),
  };
}

class SimpleFerry {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = DIRECTIONS['E'];
  }

  manhattanDistance() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  move(direction, distance) {
    this.x += direction.x * distance;
    this.y += direction.y * distance;
  }

  act(instruction) {
    switch (instruction.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        this.move(DIRECTIONS[instruction.action], instruction.value);
        break;
      case 'L':
        Array.from(Array(instruction.value / 90)).forEach(_ => this.direction = rotate90Left(this.direction))
        break;
      case 'R':
        Array.from(Array(instruction.value / 90)).forEach(_ => this.direction = rotate90Right(this.direction))
        break;
      case 'F':
        this.move(this.direction, instruction.value);
        break;
    }
  }
}

class FerryWithWaypoint {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.waypoint = { x: 1, y: 10 };
  }

  manhattanDistance() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  move(distance) {
    this.x += this.waypoint.x * distance;
    this.y += this.waypoint.y * distance;
  }

  moveWaypoint(direction, distance) {
    this.waypoint.x += direction.x * distance;
    this.waypoint.y += direction.y * distance;
  }

  act(instruction) {
    switch (instruction.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        this.moveWaypoint(DIRECTIONS[instruction.action], instruction.value);
        break;
      case 'L':
        Array.from(Array(instruction.value / 90)).forEach(_ => this.waypoint = rotate90Left(this.waypoint))
        break;
      case 'R':
        Array.from(Array(instruction.value / 90)).forEach(_ => this.waypoint = rotate90Right(this.waypoint))
        break;
      case 'F':
        this.move(instruction.value);
        break;
    }
  }
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(l => ({ action: l.slice(0, 1), value: parseInt(l.slice(1)) }));
}
