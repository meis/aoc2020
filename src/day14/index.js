const fs = require('fs');

module.exports = function(inputFile) {
  const operations = parseFile(inputFile);

  const memory1 = new Memory('v1');
  memory1.applyOps(operations);

  const memory2 = new Memory('v2');
  memory2.applyOps(operations);

  console.log('Sum of all values left in memory (v1):', memory1.totalValues());
  console.log('Sum of all values left in memory (v2):', memory2.totalValues());
};

class Memory {
  constructor(version = 'v1') {
    this.memory = {};
    this.mask = ''.padStart(36, 'X').split('');
    this.version = version;
  }

  applyOps(ops) {
    ops.forEach(op => this.applyOp(op));
  }

  applyOp(op) {
    if (op.mask) this.setMask(op.mask)
    else if (this.version == 'v1') this.setValue(op.address, op.value)
    else this.setValueV2(op.address, op.value)
  }

  setMask(mask) {
    this.mask = mask;
  }

  setValue(address, value) {
    const binaryValue = intToBinary(value);
    const valueWithMask = binaryValue.map((bit, index) => {
      return this.mask[index] === 'X' ? bit : this.mask[index]
    });

    this.memory[address] = valueWithMask;
  }

  setValueV2(address, value) {
    const binaryValue = intToBinary(value);
    const binaryAddress = intToBinary(address);

    const allAddresses = addressesToWrite(binaryAddress, this.mask);
    allAddresses.forEach(a => this.memory[a] = binaryValue);
  }

  totalValues() {
    let total = 0;
    Object.values(this.memory).forEach(b => total += binaryToInt(b));
    return total;
  }
}

class OpChangeMask {
  constructor(mask) {
    this.mask = mask;
  }
}

class OpSetValue {
  constructor(address, value) {
    this.address = address;
    this.value = value;
  }
}

function intToBinary(int) {
  binary = (int >>> 0).toString(2)
  return binary.padStart(36, 0).split('');
}

function binaryToInt(binary) {
  return parseInt(binary.join(''), 2);
}

function addressesToWrite(address, mask) {
  const addresses = [0];

  for (let i = 35; i >= 0; i--) {
    const index = 35 - i;
    const bit = address[i];
    const maskOnThisBit = mask[i];

    if (maskOnThisBit === '0') {
      if (bit == '0') continue;
      for (let j = 0; j < addresses.length; j++) {
        addresses[j] += 2 ** index;
      }
    }
    else if (maskOnThisBit === '1') {
      for (let j = 0; j < addresses.length; j++) {
        addresses[j] += 2 ** index;
      }
    }
    else {
      const split = addresses.map(a => a + 2 ** index );
      addresses.push(...split);
    }
  }

  return addresses;
}

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l !== "")
    .map(row => {
      if (row.startsWith('mask =')) {
        return new OpChangeMask(
          row.split('= ')[1].split('')
        );
      } else {
        const value = parseInt(row.split('= ')[1]);
        const address = parseInt(row.split('[')[1].split(']')[0]);
        return new OpSetValue(address, value);
      }
    });
}
