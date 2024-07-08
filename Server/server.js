const crypto = require('crypto');
const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const Axios = require('axios');
var cookie = require('cookie');
const querystring = require('node:querystring'); 
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
const redirectUrl = inProduction ? "https://protosite.online" : "http://localhost:3000"

//Used so that it trusts the proxy nginx innately has
app.set('trust proxy', 1);

//creating a redis database and connnecting to it
const redisClient = redis.createClient();

redisClient.connect();

//ensuring the connection is successfull
redisClient.on('error', function(err){
    console.log(err)
});
redisClient.on('ready', function(err){
    console.log("connected to redis successfully")
})

app.set('port', 5000);
app.use(express.json());

//the domains allowed to access the api endpoints of this server, as well as if credentials are allowed
const corsOptions = {
    origin: ["https://protosite.online", "http://localhost:3000"],
    optionsSucessStatus: 204,
    credentials: true,
};

//using this to handle preflight requests so that they also intake the corsOptions
app.options('*', cors(corsOptions));

//creating a privatekey that is used to ensure that when users request obtain authorization, the request has not been tampered with
//plan to create rotating privatekeys in the future
const privateKey = crypto.randomBytes(32);
var codeVerifier = base64URLEncode(crypto.randomBytes(32));

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

//set the expiration date to 1 hour after the current date and return the expiration date
function getExpireDate(){
    const addHours = 1 * 60 * 60 * 1000
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + addHours);
    return expireDate;
}

async function refreshToken(clientKey) {
    //we grab the users refresh token (the user will not exist if there is no refresh token)
    //this is beecause the client expires at the same time as the refresh token expires (not yet implemented)
    const refreshToken = await redisClient.hGet(clientKey, 'refresh_token');

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

        //set all the information to the users entry
        redisClient.hSet(clientKey, "access_token", response.access_token);
        redisClient.hSet(clientKey, "refresh_token", response.refresh_token);
        //we set the expiration date of the access token to 1 hour after the current date
        redisClient.hSet(clientKey, "expire_date", getExpireDate().toString());
        //expire the client entry in 1 week
        redisClient.expire(clientKey, 604800);
}

//returns true/false depending on if the expire_date is in the past/future
async function accessTokenExpired(clientKey){
    const expireDate = new Date(await redisClient.hGet(clientKey, 'expire_date'));
    const curDate = new Date();
    return (curDate >= expireDate)
}

async function validation(req){
    const clientKey = getClientKey(req);
    //if the user exists
    if (clientKey){
        //if the clients access token is expired, or does not have one
        if (accessTokenExpired(clientKey) || !await redisClient.hExists(clientKey, 'access_token')){
            refreshToken(clientKey);
            return true;
        }
    } else{
        return false;
    }
}

app.post('/authorization', cors(corsOptions), async function(req, res) {
    //creating 2 randomized codes
    const clientKey = base64URLEncode(crypto.randomBytes(32));
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
    const scope = "streaming user-modify-playback-state";
    const state = randomStr +"."+signature;

    //creating a url to add query parameters to later
    var authUrl = new URL("https://accounts.spotify.com/authorize");

    //params to add to the authUrl
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri+"/token",
    }

    //we create the authUrl and send it back to the user. This is because we need to redirect the user to that url with those params
    authUrl.search = new URLSearchParams(params).toString();
    authUrl = authUrl.toString();

    res.send({
        authUrl,
    });
});

//used as a simpler way to get the client key from the cookie
function getClientKey(req){
    //ensure the user has a key
    if (req.headers.cookie){
        return cookie.parse(req.headers.cookie).clientKey;
    }
}

//used as a simple way to obtain the users access token
async function getAccessToken(clientKey){
    try{
        return await redisClient.hGet(clientKey, 'access_token');
    }catch{
        return false};
}

//this is used every reload/first render to determine if the user has a valid access token
//and acquire a new one if the old one is expired
app.get("/getValidation", cors(corsOptions), async function(req, res){
    res.send(await validation(req));
});

//deletes the client entry when they logout
app.get("/logOut", cors(corsOptions), function(req, res){
    const clientKey = getClientKey(req);
    redisClient.del(clientKey);
});

app.get("/token", cors(corsOptions), async function(req, res){
    const state = req.query.state;
    const clientKey = cookie.parse(req.headers.cookie).clientKey;

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
            redisClient.hSet(clientKey, "expire_date", getExpireDate().toString());
            redisClient.expire(clientKey, 604800);
            
            res.redirect(redirectUrl+"/SpotifyAPI");
    } else {
        console.log("state does not match")
    }
});

app.post('/getArtists', cors(corsOptions), async function(req, res) {
    const clientKey = getClientKey(req);
    let endPoint = "https://api.spotify.com/v1/search?";
    const searchKey = req.body.searchKey;
    let accessToken = await getAccessToken(clientKey);

    if (validation(req)){
        //we stringify the paramaters and add them to the endPoint url
        const params = querystring.stringify({
            q: searchKey,
            type: "artist"
        });
        endPoint = endPoint+params

        //obtain all the artists based on the users' search parameters and send them to the user
        Axios({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            url: endPoint
        }).then((response) => {
            res.send(response.data);
        }).catch((err) => {console.log(err)})
}
});

app.post('/getSongs', cors(corsOptions), async function(req, res){
    const clientKey = getClientKey(req);
    const artistId = req.body.artistId
    let endPoint = "https://api.spotify.com/v1/artists/"+artistId+"/top-tracks"
    let accessToken = await getAccessToken(clientKey);

    if (validation(req)){
        //obtain the top songs from the artist specified (innately 10 songs)
        Axios({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            url: endPoint,
            params: {
                country: "NA"
            }
        }).then((response) => {
            console.log(response.data)
            res.send(response.data);
        }).catch((err) => {console.log(err)})
}})

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

//dbConnect();s

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