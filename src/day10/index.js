const fs = require('fs');

module.exports = function(inputFile) {
  const joltages = parseFile(inputFile);
  const diffs = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  }

  for (let i = 0; i < joltages.length -1; i++) {
    const current = joltages[i];
    const next1 = joltages[i + 1];
    diffs[next1 - current]++;
  }

  let i = 0
  let counter = 1;
  while (i < joltages.length - 1) {
    const [hops, nextIndex] = exploreBranch(joltages, i);
    counter *= hops;
    i = nextIndex;
  }

  console.log([
    'The number of 1-jolt differences multiplied by the number of 3-jolt differences is:',
    diffs[1] * diffs[3]
  ].join(' '));
  console.log([
    'The total number of distinct ways the adapters can be arranged is:',
    counter,
  ].join(' '));
};

function exploreBranch(joltages, i) {
  const current = joltages[i];
  const branches = [];
  let hops, nextIndex;

  for (let j = i + 1; j < joltages.length - 1 && joltages[j] <= current + 3; j++) {
    branches.push(j);
  }

  if (branches.length <= 1) {
    hops = 1;
    nextIndex = i + 1;
  }
  else {
    let expanded = branches.map(j => exploreBranch(joltages, j));
    hops = expanded.map(b => b[0]).reduce((acc, current) => acc + current, 0);
    nextIndex = Math.max(...expanded.map(e => e[1]))
  }
  return [hops, nextIndex];
}

function parseFile(file) {
  let joltages = fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(line => parseInt(line))
    .sort((a, b) => a - b);

  joltages.unshift(0);
  joltages.push(joltages[joltages.length -1] + 3);

  return joltages;
}
