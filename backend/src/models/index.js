const sequelize = require('../config/database');
const Job = require('./Job');
const User = require('./User');

module.exports = { sequelize, Job, User };
