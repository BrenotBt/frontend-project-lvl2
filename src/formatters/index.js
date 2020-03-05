import json from './json';
import plain from './plain';
import unstructured from './unstructured';

const formats = { json, plain, unstructured };
export default (data, format) => formats[format](data);
