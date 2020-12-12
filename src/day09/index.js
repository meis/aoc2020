const fs = require('fs');

const preambleSize = 25;

module.exports = function(inputFile) {
  numbers = parseNumbers(inputFile);

  for (let i = preambleSize; i < numbers.length; i++) {
    const preamble = buildPreamble(preambleSize, numbers, i);
    const number = numbers[i];

    const isValid = checkValid(number, preamble);

    if (!isValid) {
      const range = findFirstRangeThatSums([...numbers].splice(0, i), number);
      const min = Math.min(...range);
      const max = Math.max(...range);

      console.log(`The first invalid number is: ${number}`);
      console.log(`The encryption weakness is: ${min + max}`);
      break;
    }
  }
}

function buildPreamble(size, array, i) {
  return [...array].splice(i - size, size);
}

function checkValid(number, preamble) {
  let valid = false;

  for (let i = 0; i < preamble.length; i++) {
    for (let j = i + 1; j < preamble.length; j++) {
      let first = preamble[i];
      let second = preamble[j];
      if (first !== second) {
        if (first + second === number) {
          valid = true;
        }
      }
    }
  }

  return valid;
}

function findFirstRangeThatSums(array, number) {
  let range = [];

  for (let i = 0; i < array.length -1; i++) {
    let sum = array[i];
    let j = i + 1;
    while (j < array.length) {
      sum += array[j];
      if (sum === number) {
        break;
      }
      j++;
    }
    if (sum === number) {
      range = [...array].splice(i, j - i + 1);
      break;
    }
  }

  return range;
}

function parseNumbers(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(line => parseInt(line));
}
