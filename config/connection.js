//this file is what sets up the mysql database
//imports sequelize and gives it a class
const Sequelize = require('sequelize');

//needs dotenv to access sens info
require('dotenv').config();

//does not handle database connection errors or authentication errors

// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: 'localhost',
//     dialect: 'mysql'
//   });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  });

  module.exports = sequelize;
