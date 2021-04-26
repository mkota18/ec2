var mysql = require('mysql');
// console.log(process.env);
process.env.RDS_HOSTNAME = 'databasenew.cxeexchfk976.us-east-2.rds.amazonaws.com';
process.env.RDS_PASSWORD = 'adminrds';
process.env.RDS_USERNAME = 'adminrds12345' ;
process.env.RDS_PORT = 3306;

var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

// connection.end()