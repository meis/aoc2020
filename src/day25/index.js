const fs = require('fs');

module.exports = function(inputFile) {
  const [cardPK, doorPK] = parseFile(inputFile);
  const m = BigInt(20201227);

  let cardLoopSize = 0;
  let value = BigInt(1);
  while (value != BigInt(cardPK)) {
    value = (BigInt(7) * value) % m;
    cardLoopSize++;
  }

  let encriptionKey = BigInt(1);
  for (i = 0; i < cardLoopSize; i++) {
    encriptionKey = (doorPK * encriptionKey) % m;
  }

  console.log('The encryption key is:', parseInt(encriptionKey));
};

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(x => x != '')
    .map(x => BigInt(x));
}
