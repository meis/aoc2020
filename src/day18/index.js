const fs = require('fs');

module.exports = function(inputFile) {
  const lines = fs.readFileSync(inputFile)
    .toString()
    .split("\n")
    .filter(x => x != '');
  const tokens = lines.map(l => tokenize(l));
  const expressions = tokens.map(t => new Expression(t));

  const resultsRegular = expressions.map(e => regularMath(e));
  const totalRegular = resultsRegular.reduce((a, b) => a + b, 0);

  const resultsAdvanced = expressions.map(e => advancedMath(e));
  const totalAdvanced = resultsAdvanced.reduce((a, b) => a + b, 0);

  console.log('The sum of all the expressions using regular math is:', totalRegular);
  console.log('The sum of all the expressions using advanced math is:', totalAdvanced);
};

const SumOp = 'SUM';
const MulOp = 'MUL';

class Expression {
  constructor(tokens) {
    this.tokens = tokens;
  }
}

function regularMath(expression, tokenTransformation = (t) => [...t]) {
  const tokens = tokenTransformation(expression.tokens);
  const first = tokens.shift();
  let value = first instanceof Expression ? regularMath(first, tokenTransformation) : first;

  while (tokens.length > 0) {
    const op = tokens.shift();
    const nextToken = tokens.shift();
    const nextValue = nextToken instanceof Expression ? regularMath(nextToken, tokenTransformation) : nextToken;

    if (op === MulOp) {
      value *= nextValue;
    }
    else {
      value += nextValue;
    }
  }

  return value;
}

function advancedMath(expression) {
  // Transform the expression 1 + 2 * 3 into (1 + 2) * 3
  const tokenTransformation = (tokens) => {
    if (tokens.length === 1) return [...tokens];
    if (!tokens.includes(MulOp)) return [...tokens];

    let originalTokens = [...tokens];
    let newTokens = [];
    let currentBatch = [];
    while (originalTokens.length > 0) {
      const currentToken = originalTokens.shift();
      if (currentToken == MulOp) {
        newTokens.push(new Expression(currentBatch));
        newTokens.push(MulOp);
        currentBatch = [];
      }
      else {
        currentBatch.push(currentToken)
      }
    }
    newTokens.push(new Expression(currentBatch));

    return newTokens;
  }

  return regularMath(expression, tokenTransformation);
}

function tokenize(expression) {
  const tokens = [];
  const chars = expression.split(' ').join('').split('');

  while(chars.length > 0) {
    const currentChar = chars.shift();
    if (currentChar == '+') tokens.push(SumOp);
    else if (currentChar == '*') tokens.push(MulOp);
    else {
      if (currentChar == '(') {
        let subExpr = '';
        let opened = 1;

        while (opened > 0) {
          const subExprChar = chars.shift();
          if (subExprChar === ')') opened -= 1;
          if (subExprChar === '(') opened += 1;
          if (opened > 0) {
            subExpr += subExprChar;
          }
        }

        tokens.push(new Expression(tokenize(subExpr)));
      }
      else {
        tokens.push(parseInt(currentChar));
      }
    }
  }
  return tokens;
}
