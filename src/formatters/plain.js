import _ from 'lodash';
import types from '../types';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const format = (ast, parentKey = '') => _.map(ast, (node) => {
  const currentKey = parentKey !== '' ? `${parentKey}.${node.key}` : node.key;
  let result = null;
  if (node.type === types.unchanged) {
    result = null;
  } else
  if (node.type === types.deleted) {
    result = `Property '${currentKey}' was ${node.type}`;
  } else
  if (node.type === types.added) {
    result = `Property '${currentKey}' was ${node.type} with value: ${getValue(node.value)}`;
  } else
  if (node.type === types.changed) {
    result = `Property '${currentKey}' was ${node.type}. From ${getValue(node.oldValue)} to ${getValue(node.newValue)}`;
  } else {
    result = _.flatten(format(node.children, `${parentKey !== '' ? `${parentKey}.` : ''}${node.key}`));
  }
  return result;
});

export default (data) => {
  const lines = _.flatten(format(data));
  return _.filter(lines, (node) => node !== null).join('\n');
};
