const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  queueJobId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = Job;
