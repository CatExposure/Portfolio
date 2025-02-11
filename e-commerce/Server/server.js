const mysql = require('mysql2');
const Axios = require('axios');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const crypto = require('crypto');

const app = express();

//Used so that it trusts the proxy nginx innately has
app.set('trust proxy', 1);

app.set('port', 4000);
app.use(express.json());

//the domains allowed to access the api endpoints of this server, as well as if credentials are allowed
const corsOptions = {
    origin: ["https://protosite.online", "http://localhost:3001"],
    optionsSucessStatus: 204,
    credentials: true,
};

app.use(cors());

//using this to handle preflight requests so that they also intake the corsOptions
app.options('*', cors(corsOptions));

//this function is called everytime a connection to the database needs to be opened
//this is wrapped in a promise to allow us to await the connection to finish before executing any further code
function createConnection() {
    return new Promise((resolve, reject) => {
        try {
            const con = mysql.createConnection({
                host: process.env.HOST,
                user: process.env.ROOT_USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE
            });

            con.connect(function (err) {
                if (err) {console.log(err)}
                else {console.log("connection created!"); resolve(con);};
            });
        } catch (error) {
            reject(error);
        }   
    });
}

//this function is called whenever a query is to be executed in our dbms
//wrapped in a promise to ensure we can await the results before executing further code
function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        con.execute(query, params, (err, result, fields) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

//updates the tokens expiration date
async function updateExpireDate(clientEmail) {
    const newDate = new Date(new Date().setDate(new Date().getDate() + 7));
    const query = "UPDATE userInfo SET authExpire = ? WHERE userEmail = ?";
    const params = [newDate, clientEmail];
    await executeQuery(query, params);
}

//obtains a token that allows the user to access the site without having to login for 7 days
async function obtainToken(clientEmail) {
    const token = crypto.randomBytes(16).toString('hex');
    const query = "UPDATE userInfo SET authCode = ? WHERE userEmail = ?";
    const params = [token, clientEmail];
    await executeQuery(query, params);
    await updateExpireDate(clientEmail);
    return token;
}

//authorizes the token to ensure it's the same token. This helps with ensuring the data is the clients, not somebody else using the clients credentials on their own behalf
async function authorizeToken(clientEmail) {
    const query = "SELECT authCode, authExpire FROM userInfo WHERE userEmail = ?";
    const params = [clientEmail];
    const result = await executeQuery(query, params);

    const curDate = new Date();

    if (curDate > result[0].authExpire) {
        return await obtainToken(clientEmail);
    } else {
        console.log("not expired");
        return result[0].authCode;
        }
}

//hashes the clients password which we use to both insert into the database as well as cross check to ensure the password they entered is the same on the DB
async function hashPW(clientPW, passwordSalt) {
    var hash = crypto.createHash('sha256');
    hash.update(clientPW);
    var pwHash = hash.digest('hex');
    hash = crypto.createHash('sha256');
    hash.update(pwHash+passwordSalt+clientPW);
    pwHash = hash.digest('hex');
    return pwHash;
}

//cross checks the password between the clients entered password and the password on the DB
async function validatePW(clientPW, passwordSalt, userPW) {
    const pwHash = await hashPW(clientPW, passwordSalt)
    if (pwHash == userPW) {
        return true;
    }
    return false;
}

async function test() {
    const con = await createConnection();
}

test()

app.post("/test", cors(corsOptions), async function(req, res){server.getConnections(function(error, count) {
    console.log(count);
})})

app.post("/login", cors(corsOptions), async function(req, res){
    console.log(req.body);
    const clientEmail = req.body.clientEmail;
    const clientPW = req.body.clientPW;

    con = await createConnection();
    con.execute("SELECT * FROM userInfo WHERE userEmail = ?", [clientEmail], async function (err, result) {
        if (err) {console.log(err)}
        //if the array length is falsey, then the query returned no data matching that email
        else if (!result.length) {con.end(); res.send("Email is invalid"); return;}

        else if (!validatePW(clientPW, result[0].passwordSalt, result[0].userPassword.toString())) {
            con.end(); res.send("Password is invalid"); return;
        }   

        const token = await authorizeToken(clientEmail);
        console.log(token)

        if (token != false) {
            const userData = {
                userName: result[0].username,
                authCode: token
            };
            con.end();
            res.send(userData)
        };
    });
})

app.post("/newLogin", cors(corsOptions), async function(req, res) {
    console.log(req);
    const clientUsername = req.body.clientUsername;
    const clientEmail = req.body.clientEmail;
    const clientPW = req.body.clientPW;
    
    con = await createConnection();
    
    const passwordSalt = crypto.randomBytes(16).toString('hex');
    const hashedPW = await hashPW(clientPW, passwordSalt);
    con.execute("INSERT INTO userInfo (username, userPassword, userEmail, passwordSalt) VALUES (?, ?, ?, ?)", [clientUsername, hashedPW, clientEmail, passwordSalt], async function (err) {
        if (err) {console.log(err); if (err.errno === 1062) {con.end(); res.send("Email already in use")}}
        else {
            con.end();
            res.send(true);
        }
    })
})

app.listen(app.get('port'), function() {
    console.log('server started: http://localhost:' +app.get('port'));
});