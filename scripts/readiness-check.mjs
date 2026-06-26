import { spawnSync } from 'node:child_process';

const commands = [
  ['npm', ['run', 'lint']],
  ['node', ['--test', 'tests/*.test.mjs']],
  ['npm', ['run', 'build']],
];

for (const [cmd, args] of commands) {
  console.log(`\n$ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nInvestorOS readiness checks passed.');
