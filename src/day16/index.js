const fs = require('fs');

module.exports = function(inputFile) {
  let { rules, myTicket, nearbyTickets } = parseFile(inputFile);

  const { validTickets, ticketScanningErrorRate } = getValidTickets(nearbyTickets, rules);

  const mapping = inferMapping(validTickets, rules);
  const solvedTicket = interpolate(myTicket, mapping);

  const departureValues = Object.keys(solvedTicket)
    .filter(r => r.startsWith('departure'))
    .map(k => solvedTicket[k]);

  console.log('The ticket scanning error rate is:', ticketScanningErrorRate);
  console.log(
    'Multiplying the six fields on my ticket that start with the word departure returns:',
    departureValues.reduce((a, b) => a * b, 1)
  );
};

function getValidTickets(tickets, rules) {
  let ticketScanningErrorRate = 0;
  let validTickets = [];

  tickets.forEach((ticket) => {
    let validTicket = true;

    ticket.forEach((value) => {
      let validValue = false;

      rules.forEach((rule) => {
        rule.ranges.forEach((range) => {
          if (value >= range.from && value <= range.to) validValue = true;
        });
      });

      if (!validValue) {
        ticketScanningErrorRate += value;
        validTicket = false;
      }
    });

    if (validTicket) {
      validTickets.push(ticket);
    }
  });

  return { validTickets, ticketScanningErrorRate }
}

function interpolate(ticket, mapping) {
  const interpolated = {};

  Object.keys(mapping).forEach((key) => {
    interpolated[key] = ticket[mapping[key]];
  });

  return interpolated;
}

function inferMapping(validTickets, rules) {
  const possible = {};
  const ruleNames = rules.map(r => r.name);
  ruleNames.forEach(ruleName => {
    possible[ruleName] = Array.from(validTickets[0].keys());
  });

  validTickets.forEach((ticket) => {
    ticket.forEach((value, index) => {
      rules.forEach((rule) => {
        let validForRule = false;

        rule.ranges.forEach((range) => {
          if (value >= range.from && value <= range.to) validForRule = true;
        });

        if (!validForRule) {
          possible[rule.name] = possible[rule.name].filter(f => f !== index)
        }
      });
    });
  });

  while(! Object.values(possible).every(p => p.length === 1)) {
    const alreadyAssigned = Object.values(possible).filter(p => p.length === 1).map(p => p[0]);

    Object.keys(possible).forEach((key) => {
      const rule = possible[key];
      if (rule.length > 1) {
        possible[key] = rule.filter(f => !alreadyAssigned.includes(f));
      }
    });
  }

  const mapping = {};
  Object.keys(possible).forEach(k => mapping[k] = possible[k][0]);

  return mapping;
}

function parseFile(file) {
  const parts = fs.readFileSync(file)
    .toString()
    .split("\n\n")
    .map(row => row.split("\n"));

  parts[1].shift();
  parts[2].shift();

  const rules = parts[0].map(r => {
    const name = r.split(':')[0];
    const ranges = r.split(': ')[1].split(' or ').map(range =>{
      const [from, to] = range.split('-').map(i => parseInt(i));
      return { from, to };
    });

    return { name, ranges }
  });
  const myTicket = parts [1][0].split(',').map(f => parseInt(f));
  const nearbyTickets = parts[2].filter(l => l !== "").map(t => t.split(',').map(f => parseInt(f)));

  return ({ rules, myTicket, nearbyTickets });
}
