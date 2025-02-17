const Axios = require('axios');
const cors = require('cors');
const express = require('express');
const pg = require('pg');
const fs = require('fs');
const path = require('path');
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

//we use a pool as this allows a 'pool' of open connections to pull from to use instead of creating a connetion for every request
//pools close on their own after a query
const { Pool } = pg

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.ROOT_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, "./us-east-2-bundle.pem")).toString(),
    }
});

function errorHandler(err) {
    switch(parseInt(err.code)) {
        case 23505:
            return ("This email already exists");
        default:
            return ("An unkown error has occured:\n"+err)
    }
}

//this function is called whenever a query is to be executed in our dbms
//wrapped in a promise to ensure we can await the results before executing further code
function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, result, fields) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

async function test() {
    const query="SELECT * FROM users WHERE user_id = $1";
    const params = [1];

    await executeQuery(query, params)
    .then(result => console.log(result.rows[0]))
    .catch(errCode => console.log(errorHandler(errCode)));
}

test()

//updates the tokens expiration date
async function updateExpireDate(clientEmail) {
    const newDate = new Date(new Date().setDate(new Date().getDate() + 7));
    const query = "UPDATE users SET auth_expire = $1 WHERE email = $2";
    const params = [newDate, clientEmail];
    await executeQuery(query, params)
    .catch(errCode => console.log(errorHandler(errCode)));
}

//obtains a token that allows the user to access the site without having to login for 7 days
async function obtainToken(clientEmail) {
    const token = crypto.randomBytes(16).toString('hex');
    const query = "UPDATE users SET auth_code = $1 WHERE email = $2";
    const params = [token, clientEmail];
    await executeQuery(query, params)
    .catch(errCode => console.log(errorHandler(errCode)));
    await updateExpireDate(clientEmail);
    return token;
}

//authorizes the token to ensure it's the same token. This helps with ensuring the data is the clients, not somebody else using the clients credentials on their own behalf
async function authorizeToken(clientEmail) {
    let result;
    const query = "SELECT auth_code, auth_expire FROM users WHERE email = $1";
    const params = [clientEmail];

    await executeQuery(query, params)
    .then(promiseResult => result = promiseResult.rows[0])
    .catch(errCode => console.log(errorHandler(errCode)));

    const curDate = new Date();

    if (curDate > result.auth_expire) {
        return await obtainToken(clientEmail);
    } else {
        console.log("not expired");
        return result.auth_code;
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

app.post("/test", cors(corsOptions), async function(req, res){

});

app.post("/login", cors(corsOptions), async function(req, res){
    const clientEmail = req.body.clientEmail;
    const clientPW = req.body.clientPW;
    const query = "SELECT * FROM users WHERE email = $1";
    const params = [clientEmail];

    await executeQuery(query, params)
    .then((result) => {
        result = result.rows[0];

        //if the array length is falsey, then the query returned no data matching that email
        if (!result.email) {res.send("Email is invalid"); 
            return;
        }
        else if (!validatePW(clientPW, result.password_salt, result.password.toString())) {
            res.send("Password is invalid"); 
            return;
        }   
    
        authorizeToken(clientEmail)
        .then((token) => {console.log(token)
    
            if (token != false) {
                const userData = {
                    clientFirstName: result.first_name,
                    auth_code: token
                };
                res.send(userData)
            };})
    })
    .catch(errCode => console.log(errorHandler(errCode)));
});

app.post("/newLogin", cors(corsOptions), async function(req, res) {
    const clientFirstName = req.body.clientFirstName;
    const clientLastName = req.body.clientLastName;
    const clientEmail = req.body.clientEmail;
    const clientPW = req.body.clientPW;
    const passwordSalt = crypto.randomBytes(16).toString('hex');
    const hashedPW = await hashPW(clientPW, passwordSalt);
    const query = "INSERT INTO users (first_name, last_name, email, password, password_salt) VALUES ($1, $2, $3, $4, $5)"
    const params = [clientFirstName, clientLastName, clientEmail, hashedPW, passwordSalt];

    await executeQuery(query, params)
    .then(() => res.send(true))
    .catch(errCode => res.send(errorHandler(errCode)));
})

app.listen(app.get('port'), function() {
    console.log('server started: http://localhost:' +app.get('port'));
});