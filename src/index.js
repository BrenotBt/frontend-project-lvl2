#! /usr/bin/env node
import fs from 'fs';
import path from 'path';
import {
  has, keys, union, isObject,
} from 'lodash';
import parse from './parser';
import format from './formatters';
import types from './types';

const getData = (filePath) => {
  const fullFilePath = path.resolve(filePath);
  const type = path.extname(fullFilePath).slice(1);
  const data = fs.readFileSync(fullFilePath, 'utf8');
  return parse(data, type);
};

const build = (object1, object2) => {
  const keys1 = keys(object1);
  const keys2 = keys(object2);
  const unionKeys = union(keys1, keys2);

  return unionKeys.map((key) => {
    const oldValue = object1[key];
    const newValue = object2[key];

    if (!has(object1, key)) {
      return { key, value: newValue, type: types.added };
    }
    if (!has(object2, key)) {
      return { key, value: oldValue, type: types.deleted };
    }
    if (oldValue === newValue) {
      return { key, value: oldValue, type: types.unchanged };
    }
    if (isObject(oldValue) && isObject(newValue)) {
      const children = build(oldValue, newValue);
      return {
        key, oldValue, newValue, type: types.nested, children,
      };
    }
    return {
      key, oldValue, newValue, type: types.changed,
    };
  });
};

export default (firstConfig, secondConfig, formatValue = 'pretty') => {
  const object1 = getData(firstConfig);
  const object2 = getData(secondConfig);

  const result = build(object1, object2);
  return format(result, formatValue);
};
