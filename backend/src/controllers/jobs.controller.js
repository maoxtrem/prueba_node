const jobsService = require('../services/jobs.service');

async function create(request, response) {
  try {
    const { record, queuedJob } = await jobsService.createJob(request.body || {});
    return response.status(202).json({ queued: true, jobId: record.id, queueJobId: queuedJob.id });
  } catch (error) {
    console.error('No se pudo crear el trabajo:', error);
    return response.status(500).json({ error: 'No se pudo crear el trabajo' });
  }
}

async function findOne(request, response) {
  const record = await jobsService.getJob(request.params.id);
  if (!record) return response.status(404).json({ error: 'Trabajo no encontrado' });
  return response.json(record);
}

module.exports = { create, findOne };
