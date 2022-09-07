require("dotenv").config()
const mysql = require("mysql")

var con = mysql.createPool({
host : process.env.DBHOST,
database : process.env.DBNAME,
password : process.env.DBPASSWORD,
user : process.env.DBUSER,
multipleStatements : true,
connectionLimit : 10
})

module.exports = con 