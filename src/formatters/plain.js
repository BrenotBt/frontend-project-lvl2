import { flattenDeep, flatten, isObject } from 'lodash';

const getValue = (value) => (isObject(value) ? '[complex value]' : value);

const format = (ast, parentKey = '') => ast.map((node) => {
  const currentKey = parentKey !== '' ? `${parentKey}.${node.key}` : node.key;
  const lines = {
    deleted: () => `Property '${currentKey}' was ${node.type}`,
    added: () => `Property '${currentKey}' was ${node.type} with value: ${getValue(node.value)}`,
    changed: () => `Property '${currentKey}' was ${node.type}. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`,
    nested: () => flatten(format(node.children, `${parentKey !== '' ? `${parentKey}.` : ''}${node.key}`)),
    unchanged: () => null,
  };

  return lines[node.type]();
});

export default (data) => (
  flattenDeep(format(data))
    .filter((node) => node !== null)
    .join('\n')
);
