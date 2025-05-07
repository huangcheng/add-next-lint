import { spawnSync } from 'node:child_process';
import chalk from 'chalk';

import {
  program,
  isNextProject,
  detectPackageManager,
  isTypescriptProject,
} from './libs';

import { packages } from './consts';

const main = () => {
  // const templateDir = `${__dirname}/templates`;

  program.parse();

  const options = program.opts();

  const directory: string = program.args?.[0] ?? process.cwd();

  if (options.help) {
    program.outputHelp();

    return;
  }

  if (!isTypescriptProject(directory)) {
    console.error(chalk.red('Error: Not a TypeScript Project.'));

    return;
  }

  if (!isNextProject(directory)) {
    console.error(chalk.red('Error: Not a Next.js Project.'));

    return;
  }

  console.log(
    chalk.green('Adding additional linting tools for Next.js projects...'),
  );

  console.log(chalk.blue('Detecting package manager...'));

  const pm = detectPackageManager(directory);

  let command = '';

  switch (pm) {
    case 'npm': {
      command = 'npm install --save-dev';

      break;
    }
    case 'yarn': {
      command = 'yarn add --dev';

      break;
    }
    case 'pnpm': {
      command = 'pnpm add --save-dev';

      break;
    }
  }

  console.log(chalk.blue('Installing additional packages...'));

  command = `${command} ${packages.join(' ')}`;

  spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  });

  console.log(chalk.green('Linting tools added successfully!'));

  console.log(chalk.blue('Copying config files...'));

  // Copy config files to the project directory
  // spawnSync(`cp -r ${templateDir}/* ${directory}`, {
};

main();
