const oracledb = require('oracledb');
const express = require('express');
const app = express();
require("dotenv").config();
let connect;
const mysql = require('mysql2');

app.set('port', 5000);
app.use(express.json());

async function dbConnect(){
    try {
        connect = await oracledb.getConnection( {
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });
    } catch (err) {
        console.log(err)
    } finally {
        if (connect) {
            console.log("connection successful!")

        } else {
            console.log("connection unsuccessful :(")
        }
    }
}

app.get('/test', function(req, res) {
    var sql = "SELECT * from USERS"
    connect.execute(sql, function(err, data) {
        if (err){
            console.log(err);
            process.exit(1);
        }
        console.log(data)
        res.send(data);
    })
});

dbConnect();

app.listen(app.get('port'), function() {
    console.log('CORS-enabled web server started: http://localhost:' +app.get('port'));
})