import json from './json';
import plain from './plain';

const formats = { json, plain };
export default (data, format) => formats[format](data);
