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

app.put('/userUpdate/:id', function(req, res) {
    var id = req.params.id;
    var sqlins = "UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, EMAIL = ?, ADDRESS = ?, PHONE = ?, ACCESSLEVEL = ?, PASSWORD = ? WHERE id = ?";
    var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.address, req.body.phone, req.body.access, req.body.password, id];
    var sql = mysql.format(sqlins, inserts);
    connect.execute(sql, function(err, result) {
        if(err){
            console.log(err);
            process.exit(1);
        }
        console.log("1 record updated!")
        res.end()
    })
});

app.post('/userCreate', function(req, res) {
    var sqlins = "INSERT INTO USERS (FIRSTNAME, LASTNAME, EMAIL, ADDRESS, PHONE, ACCESSLEVEL, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.address, req.body.phone, req.body.access, req.body.password];
    var sql = mysql.format(sqlins, inserts);

    connect.execute(sql, function(err, result) {
        if(err){console.log(err);
            process.exit(1);
        }
        console.log("1 record created!");
        res.end();
    })
});

app.delete('/userDelete/:id', function(req, res) {
    var id = req.params.id
    var sqlins = "DELETE FROM USERS WHERE ID = ?"
    var inserts = [id]
    var sql = mysql.format(sqlins, inserts)

    connect.execute(sql, function(err, result) {
        if(err){console.log(err);
            process.exit(1);
        }
        console.log("1 record deleted!");
        res.end();
    })
});

app.listen(app.get('port'), function() {
    console.log('CORS-enabled web server started: http://localhost:' +app.get('port'));
});