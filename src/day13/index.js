const fs = require('fs');

module.exports = function(inputFile) {
  const [timestamp, buses] = parseFile(inputFile);
  const [earlierBus, earlierTimestamp] = getEarlierBus(timestamp, buses);

  console.log(
    'The ID of the earlies multiplied by the wait time is:',
    earlierBus * (earlierTimestamp - timestamp),
  );

  console.log(
    'The earliest timestamp that matches all conditions is:',
    getEarliestTimestampForRules(buses),
  );
};

function getEarlierBus(timestamp, buses) {
  return buses
  .map(b => b.id)
  .map(n => [n, Math.floor(timestamp/n)])
  .map(b => [b[0], b[0] * (b[1] + 1)])
  .sort((a, b) => a[1] - b[1])[0];
}

// Because all the buses have prime id's we can apply the Chinese
// Reminder Theorem (https://en.wikipedia.org/wiki/Chinese_remainder_theorem)
// Gauss's Algorithm. Let N=n1n2...nr then
// x ≡ c1N1d1 + c2N2d2 + ... + crNrdr (mod N)
// where Ni = N/ni and di ≡ Ni-1 (mod ni).
function getEarliestTimestampForRules(buses) {
  const N = BigInt(buses.map(b => b.id).reduce((a, b) => a * b, 1));
  let congruence = BigInt(0);

  buses.forEach((bus) => {
    const ni = BigInt(bus.id);
    const ci = BigInt((- bus.position));
    const Ni = BigInt(N / ni);
    const di = modularInverse(Ni, ni);

    congruence += ci * Ni * di;
  });

  return parseInt((congruence % N) + N);
}

function modularInverse(a, b) {
  const b0 = b;
  let [x0, x1] = [BigInt(0), BigInt(1)];

  if (b === 1) {
    return 1;
  }
  while (a > 1) {
    const q = BigInt(Math.floor(parseInt(a) / parseInt(b)));
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
}

function parseFile(file) {
  const contents = fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "");

  return [
    parseInt(contents[0]),
    contents[1].split(',').map((l, position) => ({ position, id: parseInt(l) })).filter(b => !isNaN(b.id)),
  ]
}
