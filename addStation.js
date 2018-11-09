'use strict';

var mysql = require('mysql');
const connection = createDBConnection();

function createDBConnection() {
  let conn = mysql.createConnection({
    host : 'localhost',
    user : 'root', //add needed user details here
    password : '',
    database : 'weather'
  });
  return conn;
}
//check this still!!
let data = JSON.parse( `{
  "stas":
	[
		{"stationID": 6,
		"stationName": "Orrengrund",
		"locationArea": "ORRE",
		"stationMgr": 8,
		"stationStatus": 1,
		"stationError": 0,
		"encryptionKey": "xKdn6",
    "connectionType": "wifi",
    "gps": "60.165, 26.265",
    "dataPulseInterval": 60},
    {"stationID": 7,
		"stationName": "Kallan",
		"locationArea": "KALL",
		"stationMgr": 9,
		"stationStatus": 0,
		"stationError": 0,
		"encryptionKey": "nNjx5syFfg",
		"connectionType": "ethernet",
    "gps": "63.451, 22.315",
    "dataPulseInterval": 60},
]
}`);

addNewStation(data);

function addNewStation(data) {
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection ok");
	  let sql = `INSERT INTO stations VALUES ('${data.stas[0].stationID}','${data.stas[0].stationName}',`+
    `'${data.stas[0].locationArea}','${data.stas[0].stationMgr}','${data.stas[0].stationStatus}',`+
    `'${data.stas[0].stationError}','${data.stas[0].encryptionKey}','${data.stas[0].connectionType}',`+
    `'${data.stas[0].gps}','${data.stas[0].dataPulseInterval})`;

	connection.query(sql, function (error, result) {
		if (error) throw error;
		console.log("Number of records inserted: " + result.affectedRows);
	});
	connection.end();
}
)};
