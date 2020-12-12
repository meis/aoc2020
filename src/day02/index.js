const fs = require('fs');

module.exports = function(inputFile) {
  let totalValidWithMethod1 = 0;
  let totalValidWithMethod2 = 0;

  fs.readFileSync(inputFile).toString().split(/\n/).forEach(item => {
    const parts = item.split(' ');
    if (parts.length === 1 ) return;

    const atLeast = parts[0].split('-')[0];
    const atMost = parts[0].split('-')[1];
    const letter = parts[1].split(':')[0];
    const password = parts[2].split('');
    const lettersPresent = password.filter(l => l == letter).length

    if (lettersPresent >= atLeast && lettersPresent <= atMost) {
      totalValidWithMethod1++;
    }

    firstIndex = atLeast - 1;
    lastIndex = atMost - 1;

    validWithMethod2 = password[firstIndex] == letter ? password[lastIndex] != letter : password[lastIndex] == letter;
    if (validWithMethod2) {
      totalValidWithMethod2++;
    }
  });

  console.log(`Valid passwords with method 1: ${totalValidWithMethod1}`);
  console.log(`Valid passwords with method 2: ${totalValidWithMethod2}`);
};
