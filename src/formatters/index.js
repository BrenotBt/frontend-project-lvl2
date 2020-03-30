import json from './json';
import plain from './plain';
import pretty from './pretty';

const formats = { json, plain, pretty };
export default (data, format) => formats[format](data);
