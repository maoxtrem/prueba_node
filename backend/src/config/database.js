const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'app',
  process.env.DB_USER || 'app',
  process.env.DB_PASSWORD || 'app_dev_password',
  {
    host: process.env.DB_HOST || 'mariadb',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mariadb',
    logging: false,
  },
);

module.exports = sequelize;
