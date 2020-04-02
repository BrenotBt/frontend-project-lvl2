import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const workFormats = ['json', 'yml', 'ini'];
const resultFormats = ['json', 'plain', 'pretty'];
const fixtures = path.resolve(__dirname, '__fixtures__');

const getFilepath = (formats) => formats.map((item) => [
  path.resolve(fixtures, `before.${item}`),
  path.resolve(fixtures, `after.${item}`),
]);

const getResult = (format) => {
  const resultPath = path.resolve(fixtures, `${format}-result.txt`);
  return fs.readFileSync(resultPath, 'utf8');
};


resultFormats.forEach((format) => {
  test.each(getFilepath(workFormats))(
    `genDiff: ${format}, %s`,
    (beforePath, afterPath) => {
      expect(genDiff(beforePath, afterPath, format)).toEqual(getResult(format));
    },
  );
});
