const fs = require('fs');

module.exports = function(inputFile) {
  const nums = fs.readFileSync(inputFile).toString().split(/\n/).map(l => parseInt(l));

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === 2020) {
        console.log([
          `The two entries that sum 2020 are ${nums[i]} and ${nums[j]}`,
          `and multiplying them produces: ${nums[i] * nums[j]}`
        ].join(' '));
      }

      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 2020) {
          console.log([
            `The three entries that sum 2020 are ${nums[i]}, ${nums[j]} and ${nums[k]}`,
            `and multiplying them produces: ${nums[i] * nums[j] * nums[k]}`
          ].join(' '));
        }
      }
    }
  }
};
