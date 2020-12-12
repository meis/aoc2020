const fs = require('fs');

module.exports = function(inputFile) {
  let totalAnyoneAnswered = 0;
  let totalEveryoneAnswered = 0;

  fs.readFileSync(inputFile).toString().split(/\n\n/).forEach(line => {
    let found = {};
    let people = line.split("\n").filter(l => l !== "").length;

    line.split('').filter(l => l !== "\n").forEach(l => {
      if (!found[l]) found[l] = 0;
      found[l] += 1
    });

    totalAnyoneAnswered += Object.keys(found).length;
    totalEveryoneAnswered += Object.keys(found).filter(l => found[l] === people).length;
  });

  console.log(`Total number of question to which anyone answered "yes": ${totalAnyoneAnswered}`);
  console.log(`Total number of question to which everyone answered "yes": ${totalEveryoneAnswered}`);
};
