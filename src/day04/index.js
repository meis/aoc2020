const fs = require('fs');

module.exports = function(inputFile) {
  let validPassportsMethod1 = 0;
  let validPassportsMethod2 = 0;

  fs.readFileSync(inputFile).toString().split(/\n\n/).forEach(block => {
    const passport = parsePassport(block)

    if (Object.keys(requiredFields).every(field => passport[field])) {
      validPassportsMethod1++;
    }

    if (Object.keys(requiredFields).every(k => passport[k] && requiredFields[k](passport[k]))) {
      validPassportsMethod2++;
    }
  })

  console.log(`Valid passports (method 1): ${validPassportsMethod1}`);
  console.log(`Valid passports (method 2): ${validPassportsMethod2}`);
};

function parsePassport(block) {
  const fields = block.split("\n").join(" ").split(" ").filter(x => x != '').map(x => x.split(":"));
  return Object.fromEntries(fields);
}

const requiredFields = {
  // byr (Birth Year) - four digits; at least 1920 and at most 2002.
  byr: (v) => (v >= 1920) && (v <= 2002),
  // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  iyr: (v) => (v >= 2010) && (v <= 2020),
  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  eyr: (v) => (v >= 2020) && (v <= 2030),
  // hgt (Height) - a number followed by either cm or in:
  //     If cm, the number must be at least 150 and at most 193.
  //     If in, the number must be at least 59 and at most 76.
  hgt: (v) => {
    let number = v.slice(0, -2);
    let unit = v.slice(-2);

    if (unit === 'cm') {
      return (number >= 150) && (number <= 193);
    }
    else if (unit === 'in') {
      return (number >= 59) && (number <= 76);
    }
    return false;
  },
  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  hcl: (v) => /^#[0-9a-fA-F]{6}$/.test(v),
  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  ecl: (v) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v),
  // pid (Passport ID) - a nine-digit number, including leading zeroes.
  pid: (v) => /^[0-9]{9}$/.test(v),
};
