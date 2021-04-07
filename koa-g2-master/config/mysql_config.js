const mysql = require('mysql')

const mysqlConfig= {
    user: "root",
    password:"root",
   // password: "Eam123456",
    database: "ieam",
    //host: "10.8.0.10",
    host:"localhost",
    port: 3306
}

module.exports = mysqlConfig
