const queue = require('../config/queue');
const { Job } = require('../models');

async function createJob(payload) {
  const record = await Job.create({ name: 'example', payload });
  const queuedJob = await queue.add('example', { ...payload, dbJobId: record.id });
  await record.update({ queueJobId: String(queuedJob.id) });
  return { record, queuedJob };
}

async function getJob(id) {
  return Job.findByPk(id);
}

module.exports = { createJob, getJob };
