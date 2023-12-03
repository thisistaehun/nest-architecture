module.exports = {
  apps: [
    {
      name: 'dg-server',
      script: 'dist/src/main.js',
      instances: 2,
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      env: {
        NODE_ENV: 'prod',
      },
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
