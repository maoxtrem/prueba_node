const { Queue } = require('bullmq');

const queue = new Queue('jobs', {
  connection: { host: process.env.REDIS_HOST || 'redis', port: 6379 },
});

module.exports = queue;
