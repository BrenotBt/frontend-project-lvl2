#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parser from './parsers';
import format from './formatters';
import types from './types';

const getData = (item) => {
  let filepath = path.resolve(item);
  if (!fs.existsSync(filepath)) {
    filepath = path.join(process.cwd(), '__tests__', '__fixtures__', item);
  }
  const type = path.extname(item).slice(1);
  const data = fs.readFileSync(filepath, 'utf8');
  return parser(data, type);
};

const build = (object1, object2) => {
  const keys1 = _.keys(object1);
  const keys2 = _.keys(object2);
  const keys = _.union(keys1, keys2);

  const result = _.map(keys, (key) => {
    const value1 = object1[key];
    const value2 = object2[key];

    if (!_.has(object1, key)) {
      return { key, value: value2, type: types.added };
    }

    if (!_.has(object2, key)) {
      return { key, value: value1, type: types.deleted };
    }

    if (value1 === value2) {
      return { key, value: value1, type: types.unchanged };
    }

    if (value1 !== value2) {
      if (_.isObject(value1) && _.isObject(value2)) {
        return {
          key,
          oldValue: value1,
          newValue: value2,
          type: types.nested,
          children: build(value1, value2),
        };
      }

      return {
        key,
        oldValue: value1,
        newValue: value2,
        type: types.changed,
      };
    }

    return null;
  });

  return result;
};

export default (firstConfig, secondConfig) => {
  const object1 = getData(firstConfig);
  const object2 = getData(secondConfig);

  const result = build(object1, object2);
  return format(result);
};
