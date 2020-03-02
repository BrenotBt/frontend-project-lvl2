#! /usr/bin/env node
import commander from 'commander';
import genDiff from '.';

export default () => {
    commander
        .version('0.1.0')
        .description('Compares two configuration files and shows a difference.')
        .option('-f, --format [type]', 'Output format')
        .arguments('<firstConfig> <secondConfig>')
        .action((firstConfig, secondConfig) => {
            const result = genDiff(firstConfig, secondConfig);
            console.log(result);
        });

    commander.parse(process.argv);
};