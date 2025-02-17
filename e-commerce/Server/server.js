const mysql = require('mysql2');
const Axios = require('axios');
const cors = require('cors');
const express = require('express');

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

//using this to handle preflight requests so that they also intake the corsOptions
app.options('*', cors(corsOptions));

app.listen(app.get('port'), function() {
    console.log('server started: http://localhost:' +app.get('port'));
});