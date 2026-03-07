/**
 * PM2 config for Studio Social on VPS.
 * Run: pm2 start ecosystem.config.cjs
 * App will listen on http://0.0.0.0:3002
 */
module.exports = {
  apps: [
    {
      name: 'studio-social',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOSTNAME: '0.0.0.0',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
