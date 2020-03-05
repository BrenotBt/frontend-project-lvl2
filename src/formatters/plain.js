import _ from 'lodash';
import types from '../types';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const format = (ast, parentKey = '') => _.map(ast, (node) => {
  const currentKey = parentKey !== '' ? `${parentKey}.${node.key}` : node.key;

  switch (node.type) {
    case types.unchanged:
      return null;
    case types.deleted:
      return `Property '${currentKey}' was ${node.type}`;
    case types.added:
      return `Property '${currentKey}' was ${node.type} with value: ${getValue(node.value)}`;
    case types.changed:
      return `Property '${currentKey}' was ${node.type}. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
    default:
      return _.flatten(format(node.children, `${parentKey !== '' ? `${parentKey}.` : ''}${node.key}`));
  }
});

export default (data) => {
  const lines = _.flatten(format(data));
  return _.filter(lines, (node) => node !== null).join('\n');
};
