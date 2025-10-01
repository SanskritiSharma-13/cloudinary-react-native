const os = require('os');
const path = require('path');
const child_process = require('child_process');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  encoding: 'utf-8',
};

if (os.type() === 'Windows_NT') {
  options.shell = true;
}

// Detect which package manager is used
const userAgent = process.env.npm_config_user_agent || '';
const usingYarn = userAgent.includes('yarn');
const usingNpm = userAgent.includes('npm');

let result;

try {
  if (process.cwd() !== root || args.length) {
    // We're not in the root of the project, or additional arguments were passed
    // Forward the command to the appropriate package manager
    const command = usingNpm ? 'npm' : 'yarn';
    const finalArgs = usingNpm ? args : args;

    result = child_process.spawnSync(command, finalArgs, options);
  } else {
    // If run without arguments, perform bootstrap using detected manager
    const command = usingNpm ? 'npm' : 'yarn';
    const bootstrapArgs = usingNpm ? ['run', 'bootstrap'] : ['bootstrap'];

    console.log(`🧩 Running bootstrap using ${command}...`);
    result = child_process.spawnSync(command, bootstrapArgs, options);
  }
} catch (error) {
  console.error('❌ Bootstrap failed!');
  console.error(
    usingYarn
      ? '⚠️ Yarn command failed. Try running: yarn install'
      : usingNpm
      ? '⚠️ NPM command failed. Try running: npm install'
      : '⚠️ Please install dependencies manually using npm or yarn.'
  );
  console.error(`Error details: ${error.message}`);
  process.exit(1);
}

process.exitCode = result.status;

process.exitCode = result.status;
