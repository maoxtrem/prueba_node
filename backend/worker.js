const { Worker } = require('bullmq');
const { sequelize, Job } = require('./src/models');

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();

  const worker = new Worker('jobs', async (job) => {
    const record = await Job.findByPk(job.data.dbJobId);
    if (record) {
      await record.update({ status: 'processing' });
    }

    console.log(`[worker] procesando ${job.name} (${job.id})`, job.data);
    // Aquí va el trabajo real: emails, reportes, imágenes, etc.

    if (record) {
      await record.update({ status: 'completed' });
    }
  }, {
    connection: { host: process.env.REDIS_HOST || 'redis', port: 6379 },
  });

  worker.on('completed', (job) => console.log(`[worker] completado ${job.id}`));
  worker.on('failed', async (job, error) => {
    if (job?.data?.dbJobId) {
      await Job.update({ status: 'failed' }, { where: { id: job.data.dbJobId } });
    }
    console.error(`[worker] falló ${job?.id}:`, error);
  });
  console.log('[worker] escuchando la cola jobs');
}

start().catch((error) => {
  console.error('No se pudo iniciar el worker:', error);
  process.exit(1);
});
