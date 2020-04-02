import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const lines = {
  unchanged: () => null,
  changed: (line, currentKey) => `Property '${currentKey}' was ${line.type}. From ${getValue(line.oldValue)} to ${getValue(line.newValue)}`,
  added: (line, currentKey) => `Property '${currentKey}' was ${line.type} with value: ${getValue(line.value)}`,
  deleted: (line, currentKey) => `Property '${currentKey}' was ${line.type}`,
  nested: (line, currentKey, fn) => fn(line.children, `${currentKey}`),
};

export default (data) => {
  const iter = (item, key = '') => {
    const result = item.map((line) => {
      const currentKey = key === '' ? line.key : `${key}.${line.key}`;
      return lines[line.type](line, currentKey, iter);
    });
    return `${result.filter((str) => str !== null).join('\n')}`;
  };
  return iter(data);
};
