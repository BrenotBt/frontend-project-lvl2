import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import genDiff from '../src';

const workFormats = ['json', 'yml', 'ini'];
const resultFormats = ['json', 'plain'];
const fixtures = path.resolve(__dirname, '__fixtures__');

const getFiles = (formats) => _.map(formats, (item) => [
  path.resolve(fixtures, `before.${item}`),
  path.resolve(fixtures, `after.${item}`),
]);

const getResult = (format) => {
  const resultPath = path.resolve(fixtures, `${format}-result.txt`);
  return fs.readFileSync(resultPath, 'utf8');
};


_.forEach(resultFormats, (format) => {
  test.each(getFiles(workFormats))(
    `genDiff: ${format}, %s`,
    (beforePath, afterPath) => {
      expect(genDiff(beforePath, afterPath, format)).toEqual(getResult(format));
    },
  );
});
