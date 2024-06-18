const crypto = require('crypto');
const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const querystring = require('querystring');
var cookie = require('cookie');
const app = express();
require("dotenv").config();
let connect;
const mysql = require('mysql2');
//.ENV THE ID AND SECRET
const clientId = "b0fddc430d1245ec9a363bee851354d8";
const clientSecret = "d8a39f5f485749b9aabd92b131e0b8f0";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
//CHANGE THIS DEPENDING ON IN PRODUCTION OR NOT
const inProduction = Boolean(false);
const redirectUri = inProduction ? "https://protosite.online/api/v1" : "http://localhost:5000";

app.set('trust proxy', 1);

const redisClient = redis.createClient();

redisClient.connect();

redisClient.on('error', function(err){
    console.log(err)
});
redisClient.on('ready', function(err){
    console.log("connected to redis successfully")
})

app.set('port', 5000);
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: ["https://protosite.online", "http://localhost:3000"],
    optionsSucessStatus: 200,
    credentials: true,
};
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

const privateKey = crypto.randomBytes(32);
var codeVerifier = base64URLEncode(crypto.randomBytes(32));

app.post('/authorization', cors(corsOptions), async function(_req, res) {
    console.log("yay");
    //creating 3 randomized codes
    const clientKey = base64URLEncode(crypto.randomBytes(32));
    console.log("potentially: "+clientKey)
    var randomStr = base64URLEncode(crypto.randomBytes(32));
    res.setHeader('Set-Cookie', cookie.serialize("clientKey", clientKey, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
        secure: true, //this made the cookie not dissapear on reload??
    }));

    //creating a code challenge based off of the codeVerifier variable
    var codeChallenge = base64URLEncode(sha256(codeVerifier));

    //creating a signature from the random string + privateKey
    const signature = base64URLEncode(sha256(randomStr + privateKey)); 
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
        redirect_uri: redirectUri+"/token",
    }

    authUrl.search = new URLSearchParams(params).toString();
    authUrl = authUrl.toString();

    res.send({
        authUrl,
    });
});

app.get("/token", cors(corsOptions), async function(req, res){
    const state = req.query.state;
    const clientKey = cookie.parse(req.headers.cookie).clientKey;
    console.log(clientKey);

    //we split the state to create (randomStr SPLIT randomStr+privateKey)
    //then we add the privateKey to the randomStr and compare it to the randomStr+privateKey to ensure they are the same
    var verifyValue = base64URLEncode(sha256((state.split(".")[0] + privateKey)));
    if (verifyValue = state.split(".")[1]){
        const code = req.query.code;

        const payload = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri+"/token",
                code_verifier: codeVerifier
            }),
            }

            const body = await fetch(tokenEndpoint, payload);
            const response = await body.json();
            redisClient.hSet(clientKey, "access_token", response.access_token);
            redisClient.hSet(clientKey, "refresh_token", response.refresh_token);
            res.setHeader('Set-Cookie', cookie.serialize("balls", clientKey, {
                httpOnly: true,
                sameSite: 'none',
            }));
            res.redirect("http://localhost:3000/SpotifyAPI?" + querystring.stringify({
                "authorized": true
            }));
    } else {
        console.log("state does not match")
    }
});

app.get('/obtainTokens', cors(corsOptions), async function(req, res){
    const id = cookie.parse(req.headers.cookie).clientKey;
    console.log(await redisClient.hGet(id, "access_token"))
    res.send({
        'access_token': await redisClient.hGet(id, "access_token"),
        'refresh_token': await redisClient.hGet(id, "refresh_token"),
    })
});

app.post('/refreshToken', cors(corsOptions), async function(req, res){
    const refreshToken = req.body.refreshToken;

    const payload = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        }

        const body = await fetch(tokenEndpoint, payload);
        const response = await body.json();
        console.log(response);
        res.send(response);

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