import { Command } from 'commander';

import package_ from '../../package.json';

const { version } = package_;

const program = new Command();

program
  .name('add-next-lint')
  .description('Add Additional Linting Tools for Next.js Projects')
  .version(version)
  .option('-h, --help', 'Display help information')
  .argument('[directory]', 'Project Directory to Add Linting Tools');

export default program;
