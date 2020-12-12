const fs = require('fs');

let slopes = [
  { trees: 0, index: -1, x: 1, y: 1 },
  { trees: 0, index: -3, x: 3, y: 1 },
  { trees: 0, index: -5, x: 5, y: 1 },
  { trees: 0, index: -7, x: 7, y: 1 },
  { trees: 0, index: -1, x: 1, y: 2 },
];

module.exports = function(inputFile) {
  fs.readFileSync(inputFile).toString().split(/\n/).forEach((line, index) => {
    slopes.forEach(slope => {
      if (index % slope.y == 0) {
        slope.index = (slope.index + slope.x) % line.length;
        if (line[slope.index] == '#') slope.trees++;
      }
    });
  })

  console.log([
    "Starting at the top-left corner of your map and following a slope of right 3 and down 1",
    `I would encounter ${slopes[1].trees} trees.`
  ].join(' '));
  console.log([
    "Multiplying together the number of trees encountered on each of the listed slopes returns",
    `${slopes.map(s => s.trees).reduce((acc, curr) => acc * curr)}.`
  ].join(' '));
};
