const fs = require('fs');

module.exports = function(inputFile) {
  const { rules, messages } = parseFile(inputFile);

  const originalRules = buildRegex(rules);

  // Update rules
  rules[8] = { branches: [[42], [42, 8]]};
  rules[11] = { branches: [[42, 31], [42, 11, 31]]};

  const updatedRules = buildRegex(rules);

  console.log(
    'Number of messages valid with the original rules:',
    messages.filter(m => m.match(originalRules) != null).length,
  );

  console.log(
    'Number of messages valid with the updated rules:',
    messages.filter(m => m.match(updatedRules) != null).length,
  );
};

function buildRegex(rules) {
  const buildBranch = ((ruleId, subRules) => {

    // Special case 1: 11: 42 31 | 42 11 31
    // This is a bit of cheating because I'm not actually allowing a pure
    // recursive case, but 11 repetitions ought to be enough.
    if (subRules.length == 3 && subRules[1] === ruleId) {
      const r1 = recursiveBuild(subRules[0]);
      const r2 = recursiveBuild(subRules[2]);
      return `${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}(?:${r1}${r2})?${r2})?${r2})?${r2})?${r2})?${r2})?${r2})?${r2})?${r2})?${r2})?${r2}`
    }
    //Special case 2: 8: 42 | 42 8
    else if (subRules.length == 2 && subRules[1] === ruleId) {
      return recursiveBuild(subRules[0]) + '+';
    }
    return subRules.map(r => recursiveBuild(r)).join('');
  });

  const recursiveBuild = (ruleId) => {
    const rule = rules[ruleId];

    if (rule.value) return rule.value;

    return '(' + rule.branches.map(b => buildBranch(ruleId, b)).join('|') + ')';
  }

  return new RegExp(`^${recursiveBuild(0)}$`)
}

function parseRule(line) {
  const [id, sub] = line.split(': ');

  if (sub.includes('"')) {
    const value = sub.split('"')[1];
    return [id, { value }];
  }
  else {
    const branches = sub.split(' | ').map(b => b.split(' '));
    return [id, { branches }];
  }
}

function parseFile(file) {
  const [rawRules, rawMessages] = fs.readFileSync(file)
    .toString()
    .split("\n\n");

  const rules = Object.fromEntries(rawRules.split("\n").map(parseRule));

  const messages = rawMessages.split("\n").filter(l => l != "");

  return { rules, messages }
}
