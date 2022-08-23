require("dotenv").config()
const mysql = require("mysql")

var con = mysql.createConnection({
host : process.env.DBHOST,
database : process.env.DBNAME,
password : process.env.DBPASSWORD,
user : process.env.DBUSER,
multipleStatements : true
})

module.exports = con 