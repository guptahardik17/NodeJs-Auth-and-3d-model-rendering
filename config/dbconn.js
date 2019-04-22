const mysql = require('mysql');
const connection = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: 'localhost',
  user: 'root',
  password : 'root',
  database : 'scapic'
});
console.log("imported");
module.exports = connection;
