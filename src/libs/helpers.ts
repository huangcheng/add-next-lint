import { existsSync } from 'node:fs';

export const detectPackageManager = (
  directory: string,
): 'npm' | 'pnpm' | 'yarn' => {
  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

  for (const lockFile of lockFiles) {
    if (existsSync(`${directory}/${lockFile}`)) {
      return lockFile === 'package-lock.json'
        ? 'npm'
        : lockFile === 'yarn.lock'
          ? 'yarn'
          : 'pnpm';
    }
  }

  return 'npm';
};

export const isNextProject = (directory: string): boolean =>
  existsSync(`${directory}/next.config.ts`) || existsSync(`${directory}/.next`);

export const isTypescriptProject = (directory: string): boolean =>
  existsSync(`${directory}/tsconfig.json`);
