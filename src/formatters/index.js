import _ from 'lodash';
import types from '../types';

const signs = {
  added: '+',
  deleted: '-',
  unchanged: ' ',
  nested: ' ',
};

const stringify = (object, level) => {
  const baseOffset = '    ';
  const keys = _.keys(object);
  const result = _.map(keys, (key) => {
    const value = object[key];
    return `${_.repeat(baseOffset, level + 1)}${key}: ${value}`;
  });
  return `{\n${result.join('')}\n${_.repeat(baseOffset, level)}}`;
};

const getValue = (node, level) => (_.isObject(node.value)
  ? stringify(node.value, level + 1)
  : node.value
);

const format = (data, level = 0) => {
  const baseOffset = '  ';
  const offset = baseOffset + _.repeat(baseOffset, level * 2);

  return _.map(data, (node) => {
    switch (node.type) {
      case types.changed:
        return _.flatten(format([{
          type: 'deleted',
          key: node.key,
          value: node.oldValue,
        }, {
          type: 'added',
          key: node.key,
          value: node.newValue,
        }], level));
      case types.nested:
        return _.flatten([
          `${offset}${signs[node.type]} ${node.key}: {`,
          ...format(node.children, level + 1),
          `${offset}  }`,
        ]);
      default:
        return [`${offset}${signs[node.type]} ${node.key}: ${getValue(node, level)}`];
    }
  });
};

export default (data) => {
  const lines = _.flatten(format(data));
  return `\n{\n${lines.join('\n')}\n}`;
};
