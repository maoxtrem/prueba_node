const app = require('./src/app');
const { sequelize } = require('./src/models');

const port = 3000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Node escuchando en el puerto ${port}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar la API:', error);
  process.exit(1);
});
