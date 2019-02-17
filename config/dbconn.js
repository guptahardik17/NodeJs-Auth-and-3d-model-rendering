const mysql = require('mysql');
const connection = mysql.createConnection({
	supportBigNumbers: true,
	bigNumberStrings: true,
	// host: '23.94.69.34',
  // user: 'prayaasc_scapic',
  // password : 'scapic',
  // database : 'prayaasc_scapic'
	host: 'localhost',
  user: 'root',
  password : 'root',
  database : 'scapic'
});
console.log("imported");
module.exports = connection;
