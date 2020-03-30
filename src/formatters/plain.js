import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const format = (ast, parentKey = '') => _.map(ast, (node) => {
  const defaultValue = '';
  const currentKey = parentKey !== '' ? `${parentKey}.${node.key}` : node.key;
  const lines = {
    deleted: () => `Property '${currentKey}' was ${node.type}`,
    added: () => `Property '${currentKey}' was ${node.type} with value: ${getValue(node.value)}`,
    changed: () => `Property '${currentKey}' was ${node.type}. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`,
    nested: () => _.flatten(format(node.children, `${parentKey !== '' ? `${parentKey}.` : ''}${node.key}`)),
    unchanged: () => defaultValue,
  };

  return lines[node.type]();
});

export default (data) => {
  const formatedData = _.flattenDeep(format(data));
  return _.filter(formatedData, (node) => node !== '').join('\n');
};
