/**
 * PM2 config for Studio Social on VPS.
 * Run: pm2 start ecosystem.config.cjs
 * App will listen on http://0.0.0.0:3002
 *
 * IMPORTANT: interpreter must point to NVM Node 18+ (not system Node).
 * On server run: source ~/.nvm/nvm.sh && nvm use 20 && which node
 * Then put that path in interpreter below.
 */
module.exports = {
  apps: [
    {
      name: 'studio-social',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      interpreter: '/root/.nvm/versions/node/v20.20.1/bin/node',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOSTNAME: '0.0.0.0',
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
