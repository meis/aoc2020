const fs = require('fs');

module.exports = function(inputFile) {
  const lines = fs.readFileSync(inputFile).toString().split(/\n/).filter(l => l != '');
  const colors = new ColorCollection(lines);

  console.log([
    'Number of colors that can eventually contain at least one shiny gold bag:',
    colors.colorsThanCanContain('shiny gold'),
  ].join(' '));

  console.log([
    'Number of individual bags required inside a single shiny gold bag:',
    colors.bagsRequiredforColor('shiny gold')
  ].join(' '));
};

class ColorCollection {
  #store = {};

  constructor(lines) {
    lines.forEach(line => {
      const [color, parts] = this.#parseLine(line);

      if (color) {
        this.#store[color] = parts;
      }
    });
  }

  get colors() {
    return Object.keys(this.#store);
  }

  colorsThanCanContain(targetColor) {
    let totalFound = 0;

    this.colors.forEach((currentColor) => {
      if (this.canContain(currentColor, targetColor)) {
        totalFound++;
      }
    });

    return totalFound;
  }

  canContain(container, targetColor) {
    if (container === targetColor) return false;

    let can = false;
    this.#store[container].forEach((part) => {
      if (part.color === targetColor) {
        can = true;
      }
      else {
        can |= this.canContain(part.color, targetColor);
      }
    });

    return can;
  }

  bagsRequiredforColor(color) {
    return this.#totalBags(color) - 1;
  }

  #parseLine(line) {
    const [color, contain] = line.split(' bags contain ');

    let parts = []
    if (!line.includes('no other bags')) {
      parts = contain.split(', ').map((sub) => {
        let parts = sub.split(' ');
        const num = parts.shift();
        parts.pop();
        const color = parts.join(' ');

        return { num, color };
      });
    }

    return [color, parts];
  }

  #totalBags(color) {
    let total = 1;

    this.#store[color].forEach((part) => {
      total += part.num * this.#totalBags(part.color);
    });

    return total;
  };
};
