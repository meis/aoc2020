const fs = require('fs');

module.exports = function(inputFile) {
  instructions = parseInstructions(inputFile);

  const result = runInstructions(instructions);

  console.log([
    "Immediately before any instruction is executed a second time, the accumulator value is:",
    result.accumulator,
  ].join(' '));

  instructions.forEach((instruction, index) => {
    if (instruction.operation !== 'acc') {
      const modifiedInstruction = {
        operation: instruction.operation === 'jmp' ? 'nop' : 'jmp',
        argument: instruction.argument,
      };
      const modifiedInstructions = [...instructions];
      modifiedInstructions[index] = modifiedInstruction;

      const evaluation = runInstructions(modifiedInstructions);
      if (!evaluation.infinite) {
        console.log([
          "Running the fixed program, the final value of the accumulator is:",
          evaluation.accumulator,
        ].join(' '));
      }
    }
  });
};

function runInstructions(instructions) {
  const indexsVisited = [];
  let infinite = false;
  let index = 0;
  let accumulator = 0;

  while (index < instructions.length) {
    if (indexsVisited.includes(index)) {
      infinite = true;
      break;
    }
    indexsVisited.push(index);

    const instruction = instructions[index];

    switch (instruction.operation) {
      case 'acc':
        accumulator += instruction.argument;
        index++;
        break;
      case 'nop':
        index++;
        break;
      case 'jmp':
        index += instruction.argument;
        break;
    }
  }

  return { accumulator, infinite };
}

function parseInstructions(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(line => parseInstruction(line));
}

function parseInstruction(line) {
  const operation = line.split(' ')[0];
  const argument = parseInt(line.split(' ')[1]);

  return { operation, argument };
};
