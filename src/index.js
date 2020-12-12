#!/usr/bin/env node
const path = require('path');

const [, , day, inputFile = `${__dirname}/day${day}/input`] = process.argv;

const run = require(`./day${day}/index.js`);
run(path.resolve(inputFile));
