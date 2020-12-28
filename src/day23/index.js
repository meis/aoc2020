const fs = require('fs');

module.exports = function(inputFile) {
  const labels = parseFile(inputFile)

  const extendedLabels = Array(1_000_000);
  for (let i = 0; i < extendedLabels.length; i ++) {
    if (i < labels.length) {
      extendedLabels[i] = parseInt(labels[i]);
    }
    else {
      extendedLabels[i] = i + 1;
    }
  }

  const cups = new Cups([...labels]);
  const extendedCups = new Cups([...extendedLabels]);

  play(cups, labels[0], 100);
  play(extendedCups, labels[0], 10_000_000);

  console.log(
    'The labels of the cups after cup 1 are',
    [1,2,3,4,5,6,7,8].map(_ => cups.removeAfter(1)).join(''),
  );

  const [v1, v2] = [extendedCups.removeAfter(1), extendedCups.removeAfter(1)];
  console.log(
    `The two cups after cup 1 are ${v1} and ${v2}, and multiplied are:`,
    v1 * v2,
  );
};

function play(cups, currentLabel, moves) {
  for (let i = 0; i < moves; i ++) {
    let removed = [0,1,2].map(_ => cups.removeAfter(currentLabel));
    let destination = cups.destinationCup(currentLabel);
    currentLabel = cups.cupAfter(currentLabel);
    cups.insertAfter(destination, ...removed);
  }
}

class Cups {
  constructor(labels) {
    this.labels = Array(labels.length + 1);
    for (let i = 0; i < labels.length; i++) {
      this.labels[labels[i]] = labels[i + 1];
    }
    this.labels[labels[labels.length-1]] = labels[0];
    this.size = labels.length + 1;
  }

  destinationCup(label) {
    let destination = label -1;

    while (this.labels[destination] == undefined) {
      destination = ((this.size + destination - 2) % this.size) + 1;
    }

    return destination;
  }

  cupAfter(label) {
    return this.labels[label];
  }

  removeAfter(label) {
    const removed = this.labels[label];
    const next = this.labels[removed];
    this.labels[removed] = undefined;
    this.labels[label] = next;

    return removed;
  }

  insertAfter(label, ...values) {
    let current = label;
    values.forEach(value => {
      const next = this.labels[current];
      this.labels[value] = next;
      this.labels[current] = value;
      current = value;
    });
  }
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")[0]
    .split('')
    .map(i => parseInt(i));
}
