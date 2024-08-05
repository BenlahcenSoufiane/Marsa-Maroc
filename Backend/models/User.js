// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  MLE: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  fonction: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  
  Affectation: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  Observation: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  

}, {
  timestamps: true
});

module.exports = User;
