const crypto = require('crypto');
const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
let connect;
const mysql = require('mysql2');
const clientId = "b0fddc430d1245ec9a363bee851354d8";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';
//CHANGE THIS DEPENDING ON IN PRODUCTION OR NOT
const inProduction = Boolean(false);
const redirectUri = inProduction ? "https://protosite.online" : "https://localhost:3000";

app.set('port', 5000);
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: ["https://protosite.online", "https://localhost:3000"],
    optionsSucessStatus: 200,
};

console.log(redirectUri);
//encodes a random string produced by the codeVerifier
function base64URLEncode(str) {
    return str.toString('base64')
    //read regex to understand what this is doing
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

//creates a code challenge derived from the randomly created codeVerifier utilizing SHA256 hashing algorithm
function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

app.get('/authorization', cors(corsOptions), function(_req, res) {
    //creating 3 randomized codes
    var codeVerifier = base64URLEncode(crypto.randomBytes(32));
    var randomStr = base64URLEncode(crypto.randomBytes(32));
    var privateKey = base64URLEncode(crypto.randomBytes(32));

    //creating a code challenge based off of the codeVerifier variable
    var codeChallenge = base64URLEncode(sha256(codeVerifier));

    //creating a signature from the random string + privateKey
    const signature = randomStr + privateKey; 
    const scope = "user-modify-playback-state";
    const state = randomStr +"."+signature;
    var authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri+"/SpotifyAPI",
    }

    authUrl.search = new URLSearchParams(params).toString();
    authUrl = authUrl.toString();

    res.send({
        authUrl,
        codeVerifier,
        privateKey,
    })
})

async function dbConnect(){
    try {
        connect = await oracledb.getConnection( {
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECTSTRING
        });
        console.log(connect)
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
dbConnect();

app.get('/test', cors(corsOptions), function(req, res) {
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
    console.log('server started: http://localhost:' +app.get('port'));
});