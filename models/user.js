const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  ispremiumuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  totalexpenses: {
    type: Sequelize.FLOAT(),
    defaultValue: 0.00
  },
});
// Create the table if it doesn't exist

module.exports = User;