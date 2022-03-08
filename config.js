//set up database
const Sequelize = require('sequelize');
const config = new Sequelize("robo_school", "robo", "9|S~}a*bZ^XCT#b_", {dialect: 'mysql'});

module.exports = config; //same as exporting a variable from a module