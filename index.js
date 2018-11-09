'use strict';

var mysql = require('mysql');
const connection = createDBConnection();
//testFunction();

function createDBConnection() {
  let conn = mysql.createConnection({
    host : 'localhost',
    user : 'root', //add needed user details here
    password : '',
    database : 'weather'
  });
  return conn;
}
//For TESTING purposes only:
//function testFunction() {
  //connection.connect();
  //addNewStation();
  //console.log('hello sunshine!');
//}


// Osa1: adding a new station to the db:
function addNewStation() {
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection ok");
    let sql = `INSERT INTO stations (stationID, stationName, locationArea, stationMgr, stationStatus, stationError, encryptionKey, connectionType, gps, dataPulseInterval) VALUES ?`;
    var values = [
      ['4', 'Fagerholm', 'FAGE', '19', '0', '0', 'X483hcR', '3G', '60.1, 21.7', '60'],
      ['5', 'Jussarö', 'JUS', '12', '0', '0', 'ng74Fi00', '3G', '60.221, 24.335', '60']
    ];
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
    connection.end();
});




  selectSensorData(1).then(results => {  //info on one sensors
    console.log(results);
    connection.end();
  });

//get data from one sensor:
function selectSensorData(sensorID) {
  let sql = `SELECT latestMeasurement FROM sensors WHERE sensorID = ${sensorID}`;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) reject (err);
      else if (results.length ===0) resolve ("No records found")
      else {
        resolve(JSON.stringify(results));
      }
    });
  });
}


getAllSensorData().then(results => {  //info on all sensors
  console.log('info on all sensors:');
  console.log(results);
});

//get data from ALL sensors:
function getAllSensorData() {
  let sql = `SELECT latestMeasurement FROM sensors`;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) reject (err);
      else if (results.length ===0) resolve ("No records found")
      else {
        resolve(JSON.stringify(results));
      }
    });
  });
}

//add sensor data to the DB:
let data = JSON.parse(`
  {"stationID":1,
  "sensors":
  [
    {"sensorID": 1,
    "measurement": 17.5},
    {"sensorID": 3,
    "measurement": 9},
    {"sensorID": 4,
    "measurement": 2.30}
  ]
}`);

let timenow = new Date(Date.now()).toLocaleString();
dataPulseReceived(data, timenow);

function dataPulseReceived(data, timenow){ //Toimii!
	for(let i = 0; i < data.sensors.length; i++){
		let sql = `INSERT INTO measurements (Date, SensorID, Measurement_data)
		VALUES ("${timenow}", ${data.sensors[i].sensorID}, ${data.sensors[i].measurement})`;
			connection.query(sql, function(error, results){
			if(error) reject(error);
			else console.log(data.sensors.length + " rows added successfully to the database");
		  });
	}
}




// change station status (0/1)
changeStationStatus(2, 0).then(err => {
  console.log(err);
})

function changeStationStatus(stationID, status) {
  let sql = `UPDATE stations SET stationStatus = ${status} WHERE stationID = ${stationID};  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) reject (err);
      else if (results.length ===0) resolve ("Check code")
      else {
        resolve(JSON.stringify(results));
      }
    });
  });
}



let gps = '60.104, 24.974';
getSensorDataByLocation(gps).then(results => {
  console.log(results);
})
console.log('Hello sunshine! this is form GPS queryfunction'); //this will be printed before the upper one, as the function is ASYNCH. (!)

//get sensor data based on its GPS coordinates:
function getSensorDataByLocation(gps) {
  let sql = `SELECT sd.sensorTypeName, sd.latestDate, sd.latestMeasurement
FROM sensors sd, stations st
WHERE st.stationID = sd.stationID && st.gps = ${gps}`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) reject (err);
      else if (results.length ===0) resolve ("No records found")
      else {
        resolve(JSON.stringify(results));
      }
    });
  });
}
