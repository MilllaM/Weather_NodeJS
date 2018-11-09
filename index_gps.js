'use strict';

var mysql = require('mysql');
const connection = createDBConnection();


function createDBConnection() {
  var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root', //add user details here
    password : '',
    database : 'weather'
  });
  return conn;
}

//Get sensor data based on its GPS coordinates

let gps = '60.104, 24.974';
getSensorDataByLocation(gps).then(results => {
  console.log(results);
})
console.log('Hello sunshine! this is form GPS queryfunction'); //this will be printed before the upper one, as the function is ASYNCH. (!)


function getSensorDataByLocation(gps) {
  let sql = `SELECT sd.sensorTypeName, sd.latestDate, sd.latestMeasurement
  FROM sensors sd, stations st
  WHERE st.stationID = sd.stationID && st.gps = "${gps}"`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) reject (err);
      else if (results.length ===0) resolve ("No records found")
      else {
        resolve(JSON.stringify(results));
      }
    });
    connection.end();
  });
}
