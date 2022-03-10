//set up database
const Sequelize = require('sequelize');
const config = new Sequelize("mod3usecase2", "robo", "9|S~}a*bZ^XCT#b_", 
{
    dialect: 'mysql', 
    logging: false
});

module.exports = config; //same as exporting a variable from a module