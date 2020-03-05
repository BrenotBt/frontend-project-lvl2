import _ from 'lodash';
import types from '../types';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const format = (ast, parentKey = '') => _.map(ast, (node) => {
  const currentKey = parentKey !== '' ? `${parentKey}.${node.key}` : node.key;
  let result = null;
  switch (node.type) {
    case types.unchanged:
      result = null;
      break;
    case types.deleted:
      result = `Property '${currentKey}' was ${node.type}`;
      break;
    case types.added:
      result = `Property '${currentKey}' was ${node.type} with value: ${getValue(node.value)}`;
      break;
    case types.changed:
      result = `Property '${currentKey}' was ${node.type}. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
      break;
    default:
      result = _.flatten(format(node.children, `${parentKey !== '' ? `${parentKey}.` : ''}${node.key}`));
  }
  return result;
});

export default (data) => {
  const lines = _.flatten(format(data));
  return _.filter(lines, (node) => node !== null).join('\n');
};
