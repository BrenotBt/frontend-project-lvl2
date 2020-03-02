import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const filepath1 = path.resolve(__dirname, '__fixtures__/before.json');
const filepath2 = path.resolve(__dirname, '__fixtures__/after.json');
const filepath3 = path.resolve(__dirname, '__fixtures__/before-after-diff.txt');
const result = fs.readFileSync(filepath3, 'utf8');

test('gendiff', () => {
    expect(genDiff(filepath1, filepath2)).toBe(result);
});