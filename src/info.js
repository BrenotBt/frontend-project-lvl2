#! /usr/bin/env node
import commander from 'commander';

export default () => {
    commander
        .version('0.1.0')
        .description('Compares two configuration files and shows a difference.')
        //.option('-f, --format [type]', 'Output format')
        //.arguments('<firstConfig> <secondConfig>');

    commander
        //.command('*')
        .action(() => console.log('app is running'));

    commander.parse(process.argv);
};