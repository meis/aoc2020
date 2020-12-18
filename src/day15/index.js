const fs = require('fs');

module.exports = function(inputFile) {
  const startingNumbers = parseFile(inputFile);

  console.log(`The 2020th number spoken will be: ${playNIterations(startingNumbers, 2020)}`);
  console.log(`The 30000000th number spoken will be: ${playNIterations(startingNumbers, 30000000)}`);
};

function playNIterations(startingNumbers, iterations) {
  const spoken = Array(iterations);

  for (let i = 0 ; i <= startingNumbers.length - 1; i ++) {
    spoken[startingNumbers[i]] = [i, null];
  }

  let lastNumber = startingNumbers[startingNumbers.length - 1];

  for (let i = startingNumbers.length ; i < iterations ; i ++) {
    const lastSpoken = spoken[lastNumber];
    if (lastSpoken[1] === null ) {
      lastNumber = 0;
    }
    else {
      lastNumber = lastSpoken[0] - lastSpoken[1];
    }

    const next = spoken[lastNumber];
    if (!next) {
      spoken[lastNumber] = [i, null];
    }
    else {
      next[1] = next[0];
      next[0] = i;
    }
  }

  return lastNumber;
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(row => row.split(","))[0]
    .map(i => parseInt(i));
}
