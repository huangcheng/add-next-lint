#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  readdirSync,
  existsSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';
import chalk from 'chalk';

import {
  program,
  isNextProject,
  detectPackageManager,
  isTypescriptProject,
} from './libs';

import { packages } from './consts';

const main = () => {
  // eslint-disable-next-line unicorn/prefer-module
  const templateDirectory = `${__dirname}/templates`;

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

  process.chdir(directory);

  spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  });

  // eslint-disable-next-line unicorn/prefer-module
  process.chdir(__dirname);

  console.log(chalk.green('Additional packages installed successfully!'));

  console.log(chalk.blue('Copying config files...'));

  let files = readdirSync(templateDirectory).filter((file) =>
    statSync(path.join(templateDirectory, file)).isFile(),
  );

  for (const file of files) {
    const source = path.join(templateDirectory, file);
    const destination = path.join(directory, file);

    copyFileSync(source, destination);

    console.log(chalk.green(`Copied ${file} to ${directory}`));
  }

  console.log(chalk.green('Config files copied successfully!'));

  console.log('Adding husky hooks...');

  if (!existsSync(path.join(directory, '.husky'))) {
    process.chdir(directory);

    spawnSync('npx -y husky init', {
      shell: true,
      stdio: 'inherit',
    });

    // eslint-disable-next-line unicorn/prefer-module
    process.chdir(__dirname);
  }

  files = readdirSync(path.join(templateDirectory, 'husky'));

  for (const file of files) {
    const source = path.join(templateDirectory, 'husky', file);
    const destination = path.join(directory, '.husky', file);

    copyFileSync(source, destination);

    console.log(chalk.green(`Copied ${file} to ${directory}/.husky`));
  }

  console.log(chalk.green('Husky hooks added successfully!'));

  console.log(chalk.blue('Installing husky hooks...'));

  spawnSync('npx -y husky', {
    shell: true,
    stdio: 'inherit',
  });

  console.log(chalk.green('Husky hooks installed successfully!'));

  console.log(chalk.blue('Init dictionaries..'));

  if (!existsSync(path.join(directory, 'dict'))) {
    mkdirSync(path.join(directory, 'dict'));

    writeFileSync(path.join(directory, 'dict', 'project.txt'), '');
  }

  console.log(chalk.green('Dictionaries initialized successfully!'));

  console.log(chalk.green('Linting tools added successfully!'));

  process.exit(0);
};

main();
