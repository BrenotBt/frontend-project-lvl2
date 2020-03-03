import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import genDiff from '../src';

const workFormats = ['json', 'yml'];

const getFiles = (formats) => _.map(formats, (item) => [
  item,
  path.resolve(__dirname, `__fixtures__/before.${item}`),
  path.resolve(__dirname, `__fixtures__/after.${item}`),
]);

const getResult = (format) => {
  const resultPath = path.resolve(__dirname, `__fixtures__/${format}-result.txt`);
  return fs.readFileSync(resultPath, 'utf8');
};

test.each(getFiles(workFormats))(
  'genDiff',
  (format, beforePath, afterPath) => {
    expect(genDiff(beforePath, afterPath)).toBe(getResult(format));
  },
);
