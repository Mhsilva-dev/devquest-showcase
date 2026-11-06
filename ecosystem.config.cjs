module.exports = {
  apps: [{
    name: 'devquest',
    cwd: __dirname,
    script: 'node_modules/.bin/tsx',
    args: '--env-file=.env server/src/index.ts',
    env: { NODE_ENV: 'production' },
    max_memory_restart: '300M',
    time: true,
  }],
};
