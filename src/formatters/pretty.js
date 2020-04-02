import _ from 'lodash';

const baseOffset = '    ';

const stringify = (item, level = 0) => {
  if (!_.isObject(item)) {
    return item;
  }
  const result = _.toPairs(item)
    .map(([key, value]) => (
      `${baseOffset.repeat(level + 1)}${key}: ${stringify(value, level + 1)}`
    ));
  return `{\n${result.join('\n')}\n${baseOffset.repeat(level)}}`;
};

const lines = {
  unchanged: (line, level) => `${baseOffset.repeat(level)}${line.key}: ${stringify(line.value, level)}`,
  changed: (line, level) => `${baseOffset.repeat(level).slice(2)}- ${line.key}: ${stringify(line.oldValue, level)}\n${baseOffset.repeat(level).slice(2)}+ ${line.key}: ${stringify(line.newValue, level)}`,
  added: (line, level) => `${baseOffset.repeat(level).slice(2)}+ ${line.key}: ${stringify(line.value, level)}`,
  deleted: (line, level) => `${baseOffset.repeat(level).slice(2)}- ${line.key}: ${stringify(line.value, level)}`,
  nested: (line, level, fn) => `${baseOffset.repeat(level)}${line.key}: ${fn(line.children, level)}`,
};

export default (data) => {
  const iter = (item, level = 0) => {
    const result = item.map((line) => lines[line.type](line, level + 1, iter));
    return `{\n${result.join('\n')}\n${baseOffset.repeat(level)}}`;
  };
  return iter(data);
};
