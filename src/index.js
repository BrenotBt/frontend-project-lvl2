#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parser from './parsers';

const getData = (item) => {
  let filepath = path.resolve(item);
  if (!fs.existsSync(filepath)) {
    filepath = path.join(process.cwd(), '__tests__', '__fixtures__', item);
  }
  const type = path.extname(item).slice(1);
  const data = fs.readFileSync(filepath, 'utf8');
  return parser(data, type);
};

export default (firstConfig, secondConfig) => {
  const object1 = getData(firstConfig);
  const object2 = getData(secondConfig);
  const keys = _.union(_.keys(object1), _.keys(object2));

  const str = _.map(keys, (item) => {
    if (object1[item] === object2[item]) {
      return `    ${item}: ${object1[item]}\n`;
    }
    if (_.has(object1, item) && !_.has(object2, item)) {
      return `  - ${item}: ${object1[item]}\n`;
    }
    if (!_.has(object1, item) && _.has(object2, item)) {
      return `  + ${item}: ${object2[item]}\n`;
    }
    return `  + ${item}: ${object2[item]}\n  - ${item}: ${object1[item]}\n`;
  }).join('');

  return `\n{\n${str}}`;
};
