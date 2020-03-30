import {
  keys, isObject, flatten, repeat,
} from 'lodash';

const signs = {
  added: '+',
  deleted: '-',
  unchanged: ' ',
  nested: ' ',
};

const stringify = (object, level) => {
  const baseOffset = '    ';
  const result = keys(object)
    .map((key) => {
      const value = object[key];
      return `${repeat(baseOffset, level + 1)}${key}: ${value}`;
    });
  return `{\n${result.join('')}\n${repeat(baseOffset, level)}}`;
};

const getValue = (node, level) => (isObject(node.value)
  ? stringify(node.value, level + 1)
  : node.value
);

const format = (data, level = 0) => {
  const baseOffset = '  ';
  const offset = baseOffset + repeat(baseOffset, level * 2);

  return data.map((node) => {
    const lines = {
      deleted: () => [`${offset}${signs[node.type]} ${node.key}: ${getValue(node, level)}`],
      added: () => [`${offset}${signs[node.type]} ${node.key}: ${getValue(node, level)}`],
      changed: () => flatten(format([{
        type: 'deleted',
        key: node.key,
        value: node.oldValue,
      }, {
        type: 'added',
        key: node.key,
        value: node.newValue,
      }], level)),
      nested: () => flatten([
        `${offset}${signs[node.type]} ${node.key}: {`,
        ...format(node.children, level + 1),
        `${offset}  }`,
      ]),
      unchanged: () => [`${offset}${signs[node.type]} ${node.key}: ${getValue(node, level)}`],
    };

    return lines[node.type]();
  });
};

export default (data) => {
  const lines = flatten(format(data));
  return `\n{\n${lines.join('\n')}\n}`;
};
